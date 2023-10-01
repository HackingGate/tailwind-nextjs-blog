---
title: Persisting Real-Time User Data in a Go Project
date: '2023-10-01'
tags: [Go, VPN, Delta, Database, Ticker, Gin, JSON, Swift]
type: Blog
license: CC BY-SA 4.0
---

In a recent VPN project, I was tasked with implementing the backend system for the project.
The backend system consists of two parts: 
- VPN core for providing the VPN nodes and a few APIs for internal user states and stats management. Designed to be fault-tolerant and scalable.
- A set of serverless functions for managing user accounts, payments, status and stats, interacting with the VPN core for user management.

In this article, I will focus on the VPN core part. Specifically, I will talk about how I persist real-time user usage data to a database, with an API end point for querying the current user stats.

## Pseudocode

Here is the pseudocode for the system.

```text
AddAndSaveUserStatsByEmail(user, delta)
1    currentStats ← GetUserStatsFromDatabase(user)
2    updatedStats.Uplink ← currentStats.Uplink + delta.Uplink
3    updatedStats.Downlink ← currentStats.Downlink + delta.Downlink
4    SaveUserStatsToDatabase(user, updatedStats)

StartTicker()
1    ticker ← NewTicker(1 second)
2    loop
3        on ticker tick
4            Tick()

Tick()
1    users ← QueryActiveUsers()
2    for each user in users do
3        delta ← GetUserStats(user) - GetLastSavedUserStats(user)
4        AddAndSaveUserStatsByEmail(user, delta)

CurrentUserStats(request)
1    usersParams ← ParseRequest(request)
2    results ← empty mapping
3    for each userParams in usersParams.Users do
4        lastStat ← GetLastSavedUserStats(userParams.Email)
5        stats ← GetUserStats(userParams.Email)
6        lastSavedStat ← GetLastSavedUserStats(userParams.Email)
7        statResult ← lastSavedStat + stats - lastStat
8        results[userParams.Email] = statResult
9    RespondWithJSON(results)
```

The system consists of three functions: `Tick()`, `AddAndSaveUserStatsByEmail(user, delta)`, and `CurrentUserStats(request)`.

The `Tick()` function is called every second by a `Ticker`[^1] and updates the user stats in the database.

The `AddAndSaveUserStatsByEmail(user, delta)` function updates the user stats in the database. Delta[^2] is the difference between the current user stats and the last saved user stats.

The `CurrentUserStats(request)` function returns the current user stats in the database.

## Implementation

### Tick()

```go
func tick() {
	users := database.QueryActiveUsers()
	for _, user := range users {
		lock.Lock() // Locking the shared resource
		stat := user_stats.GetUserStats(user.Email)
		delta := user_stats.SubtractUserStats(stat, sharedInstance.LastUserStats[user.Email])
		if _, err := user_stats.AddAndSaveUserStatsByEmail(user.Email, delta); err != nil {
			log.Fatal(err)
			return
		}
		sharedInstance.LastUserStats[user.Email] = stat
		lock.Unlock() // Unlocking after modifying the shared resource
	}
}
```

Add the `SubtractUserStats()` function.

```go
func SubtractUserStats(us1, us2 models.UserStat) models.UserStat {
	return models.UserStat{
		Uplink:   us1.Uplink - us2.Uplink,
		Downlink: us1.Downlink - us2.Downlink,
	}
}
```

### AddAndSaveUserStatsByEmail(user, delta)

```go
func AddAndSaveUserStatsByEmail(email string, delta models.UserStat) (*models.User, error) {
	// Fetch current user stats from database
	user, err := database.GetUserByEmail(email)
	if err != nil {
		return nil, err
	}

	currentStats := models.UserStat{
		Uplink:   user.Uplink,
		Downlink: user.Downlink,
	}

	// Add the delta to current stats
	updatedStats := AddUserStats(currentStats, delta)

	// Update the user stats
	user.Uplink = updatedStats.Uplink
	user.Downlink = updatedStats.Downlink

	// Save the updated stats back to the database
	if updatedUser, err := database.UpdateUserStatsByEmail(email, &updatedStats); err != nil {
		return nil, err
	} else {
		return updatedUser, nil
	}
}
```

Add the `AddUserStats()` function.

```go
func AddUserStats(us1, us2 models.UserStat) models.UserStat {
	return models.UserStat{
		Uplink:   us1.Uplink + us2.Uplink,
		Downlink: us1.Downlink + us2.Downlink,
	}
}
```

### StartTicker()

```go
func StartTicker() {
	ticker := time.NewTicker(tickInterval)
	defer ticker.Stop()

	done = make(chan bool)
	defer close(done)

	for {
		select {
		case <-done:
			return
		case t := <-ticker.C:
			fmt.Println("Tick at", t)
			tick()
		}
	}
}
```

And start the ticker in `main()`.

```go
func main() {
    // ...
    go StartTicker()
    // ...
}
```

### CurrentUserStats(request)

```go
func CurrentUserStats(ctx *gin.Context) {
	usersParams := models.UsersParams{}

	if err := ctx.ShouldBindJSON(&usersParams); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	var results []models.UserStatParams

	for _, userParams := range usersParams.Users {
		lock.Lock()
		lastStat := sharedInstance.LastUserStats[userParams.Email]
		lock.Unlock()

		stats := user_stats.GetUserStats(userParams.Email)

		lastSavedUser, err := database.GetUserByEmail(userParams.Email)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"message": err.Error(),
			})
			return
		}

		lastSavedStat := models.UserStat{
			Uplink:   lastSavedUser.Uplink,
			Downlink: lastSavedUser.Downlink,
		}

		statResult := user_stats.SubtractUserStats(
			user_stats.AddUserStats(lastSavedStat, stats),
			lastStat,
		)

		userStatParams := models.UserStatParams{
			Email: userParams.Email,
			Stat:  statResult,
		}

		results = append(results, userStatParams)
	}

	ctx.JSON(200, results)
}
```

## Result

I have created a simple testing program that adds 1 to the uplink and downlink of the user every second.

And a bash script that queries the user stats every second.

```bash
#!/bin/bash

DB_FILE="data.db"
TABLE_NAME="users"

while true; do
    sqlite3 $DB_FILE "SELECT uplink,downlink FROM $TABLE_NAME WHERE email = 'user@example.com';"
    sleep 1
done
```

The user stats will only be updated when the testing program is running. And if the testing program is stopped or destroyed by accident, the user stats will retain and can continue to be updated when the testing program is restarted.

## Thoughts on Go

When I was first writing Go methods, I made mistake by using very simple names for them like using `UpdateUser` instead of `UpdateUserEnabledByEmail`. I thought it would be nice if I could overload the `UpdateUser` method to handle the updating of user stats.

When I first wrote the `AddUserStats()` and `SubtractUserStats()` functions, I thought it would be nice if I could overload the `+` and `-` operators for the `UserStat` type.

In languages like Swift, you have the ability to overload both methods and operators.[^3]

Overload methods

```swift
func updateUser(email: String, enabled: Bool) {
    // ...
}

func updateUser(email: String, delta: UserStat) {
    // ...
}
```

You can then use the `updateUser()` method with different parameters.

```swift
updateUser(email: "example@example.com", enabled: true)

updateUser(email: "example@example.com", delta: delta)
```


Overload operators

```swift
func - (lhs: UserStat, rhs: UserStat) -> UserStat {
    return UserStat(
        uplink: lhs.uplink - rhs.uplink,
        downlink: lhs.downlink - rhs.downlink
    )
}
```

You can then use the `-` operator to subtract two `UserStat` instances.

```swift
let delta = stat - lastSavedStat
```

However, Go does not support operator overloading.

I found the [following explanation](https://go.dev/doc/faq#overloading) on the Go FAQ page.

> Why does Go not support overloading of methods and operators?
> 
> Method dispatch is simplified if it doesn't need to do type matching as well. Experience with other languages told us that having a variety of methods with the same name but different signatures was occasionally useful but that it could also be confusing and fragile in practice. Matching only by name and requiring consistency in the types was a major simplifying decision in Go's type system.
> 
> Regarding operator overloading, it seems more a convenience than an absolute requirement. Again, things are simpler without it.


That's fine because I can use long method names like `UpdateUserEnabledByEmail()` to handle the updating of user stats.

As well as I can write a `SubtractUserStats()` function to handle the subtraction of two `UserStat` instances. 

As you can see in my above implementation, I use the `SubtractUserStats()` function to subtract two `UserStat` instances.

```go
func SubtractUserStats(us1, us2 models.UserStat) models.UserStat {
    return models.UserStat{
        Uplink:   us1.Uplink - us2.Uplink,
        Downlink: us1.Downlink - us2.Downlink,
    }
}
```

Keeping a language simple is a good thing. It makes the language easier to learn and use. In [The Rule of Least Power](https://www.w3.org/DesignIssues/Principles.html?ref=blog.codinghorror.com), Tim Berners-Lee wrote:

> The less powerful the language, the more you can do with the data stored in that language. If you write it in a simple declarative from, anyone can write a program to analyze it.

[^1]: The Go Programming Language - [Ticker of Package time](https://golang.org/pkg/time/#Ticker)
[^2]: Wikipedia - [Delta Encoding](https://en.wikipedia.org/wiki/Delta_encoding)
[^3]: The Swift Programming Language - [Operator Methods of Advanced Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/advancedoperators/#Operator-Methods)
