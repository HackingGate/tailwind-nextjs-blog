---
title: I found an error on Khan Academy
date: '2023-12-17'
tags: [Khan Academy, Error, Bug, Floating Point]
type: Blog
license: CC BY-SA 4.0
---

I was practicing my math skills on Khan Academy towards the midterm of CM1015 (Computational Mathematics) when I found an error in the solution to a problem.

There was the following problem:

> Find the sum of the first 9 terms in the following geometric series.  
> Do not round your answer.  
> 64 + 32 + 16 + ...

I started by calculating using the formula for the sum of a finite geometric series (which I learned in this [video](https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:series/x9e81a4f98389efdf:geo-series/v/deriving-formula-for-sum-of-finite-geometric-series))

$$
S_n = \frac{a(1 - r^n)}{1 - r}
$$

where `a` is the first term, `r` is the common ratio, and `n` is the number of terms. In this case, `a = 64`, `r = 1/2`, and `n = 9`.  
Then I started plugging in the values and simplifying the equation:

$$
S_9 = \frac{a(1 - r^9)}{(1 - r)}
$$

$$
S_n = \frac{64(1 - (\frac{1}{2})^9)}{1 - \frac{1}{2}}
$$

$$
S_9 = \frac{64 - \frac{1}{2^9}}{\frac{1}{2}}
$$

$$
S_9 = 128 - 2\frac{1}{2^9}
$$

Used my calculator calculated 2 to the power of 9, which is 512.

$$
S_9 = 128 - \frac{2}{512}
$$

$$
S_9 = 128 - \frac{1}{256}
$$

Then I used my calculator to calculate it and got 127.9960938.
The question said "Do not round your answer", I never encountered this kind of problem which being asked not to round the answer but the answer has a lot of decimal places.
I looked at the Khan Academy's app and submitted the simplest form I got, which is $$128 - \frac{1}{256}$$, but it said it's wrong.

I opened the hint and checked all my steps are correct but the final result said by Khan Academy is 127.75.

I tried to ask it on ChatGPT and got 127.75 too. Here is the Python Code ChatGPT used:

```python
# Correct the calculation for the sum of the geometric series
first_term = 64
common_ratio = 1/2
number_of_terms = 9

# Using the formula for the sum of a geometric series to find the sum of the first 9 terms
sum_of_series_corrected = first_term * (1 - common_ratio**number_of_terms) / (1 - common_ratio)
sum_of_series_corrected
```

I suddenly realized, isn't it the floating point error? I asked ChatGPT to recalculate it with awareness of floating point error:

```python
from decimal import Decimal, getcontext

# Set the precision high enough to handle the calculations accurately
getcontext().prec = 10

# Redefine the values using Decimal for arbitrary precision arithmetic
first_term_dec = Decimal('64')
common_ratio_dec = Decimal('1') / Decimal('2')
number_of_terms_dec = Decimal('9')

# Calculate the sum again using Decimal
sum_of_series_decimal = first_term_dec * (1 - common_ratio_dec**number_of_terms_dec) / (1 - common_ratio_dec)
float(sum_of_series_decimal)  # Convert back to float for the final result display
```

And got `127.75` as the result.
