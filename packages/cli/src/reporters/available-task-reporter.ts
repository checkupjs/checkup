export function reportAvailableTasks(availableTasks: string[]) {
  console.log();
  console.log('AVAILABLE TASKS');
  console.log();
  if (availableTasks.length > 0) {
    availableTasks.forEach((taskName) => {
      console.log(`  ${taskName}`);
    });
  } else {
    console.log(`  No tasks found`);
  }
  console.log();
}
