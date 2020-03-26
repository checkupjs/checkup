# Checkup

## Scoring and Heuristics (RFC - still WIP)

### Summary
Checkup's main value is in providing insights into the health of an application by helping users interpret the data we collect about an app in a way that can be understood by all of our targeted [personas](SPEC.md#Personas). 

For example, if a task that charts a migration is added to checkup today, and your app is 0% done with this new migration, that is totally okay. We don't expect you to be done, it only began today! The configurability of checkup is very valuable here - as the owner of a task you can provide a `failingScore` and a `passingScore` (which can be overridden via the checkup config in your application), which we use to provide a letter grade (`A`-`F`) for each task. We then do some fun math to take the grades given for each task, and the `Priority` of each task, and provide a grade for each `Category` of task, and then for the app's overall health. 

### Scoring individual tasks  

Each task will return a number. But the number itself is meaningless without context. For example, for ember apps, we want to know if your app is using volta to manage its command line tools. That is a boolean, yes or no question, so the difference between a `0` and a `1` is everything. On the other hand, lets say there is a migration task to migrate all tests in your app to use some new mocking library. If there are `1000` tests, and you've migrated `999` of them (also a difference of 1), I would say you are doing quite well! 

This is where the `failingScore` and `passingScore` come in. These will be configured in the task itself, and you will also be able to override each task's desired scores on a per app basis. 

So for each task, we will determine a letter grade based on your result's distance from the `passingScore` and `failingScore`. The 5 grades will be evenly distributed across the difference between `passingScore` and `failingScore` (obviously anything worse than failing score will be an `F`). 

#### Example: 

Lets say for task `X`, we say that 10 violations is a `passingScore`, and 30 violations is a `failingScore`. So the grade distribution will be from 10 -> 30, which has a difference of 20. Since there are 5 grades (`A`, `B`, `C`, `D`, `F`), that means each grade has a range of 4 violations, making the distribution as follows:  

| Score | Grade |
|-------|-------|
| 0-14  | A     |
| 14-18 | B     |
| 18-22 | C     |
| 22-26 | D     |
| 26-∞  | F     |

#### Alternate distribution options

For the same example above, we could also say that only `passingScore` and above count as an `A`, and only `failingScore` and below count as an `F`. So then the delta between `passingScore` and `failingScore` would be divided by 3 (`B`, `C`, `D`), making the distribution as follows: 

| Score | Grade |
|-------|-------|
| 0-10  | A     |
| 10-17 | B     |
| 17-23 | C     |
| 23-30 | D     |
| 30-∞  | F     |

### Scoring categories

There are 3 categories of tasks, `Core`, `Migrations`, and `Insights`. You will receive a grade for each section, which will be the grade for each task, multiplied by its `Priority`. Currently `Priority` is defined as an enum comprised of `low`, `medium`, `high`, I propose that we change that to a numerical value that will be used to weight the various tasks (as not all tasks are created equal). 

I think `Priority` should look more like (wording major WIP, but the important thing here is the numerical values): 

```export const enum Priority {
  Critical = 10,
  Very Important = 7,
  Important = 5,
  Minor = 3, 
  Trivial = 1
}
```

So a `Critical` task with a score of `D` would be worth 10x a `Trivial` task with a score of `A`. My assumption is that most tasks would range from 7-3. 

Alternatively, we can also just make priority a number between 1-5 or 1-10. 

### Overall health score

We also need to determine the weight of the three categories of tasks, in order to combine them into one solid health score. I propose that `Core` be weighted 2x, `Insights` 1.5x, and `Migrations` 1x. We will then take the grades of each of those sections, and multiply them out to get one final grade, or health score for the application.




