const dateStr = "2024-11-03";
// const date = new Date("2024-11-03").toLocaleString('en-US', { month: 'long' });
const date = new Date("2024-11-03").getDate(); // 0 (Sunday) to 6 (Saturday)

// // Get the abbreviated month name
// const options = { month: 'long' };
// const monthAbbr = date.toLocaleString('en-US', options).toUpperCase(); // "MAR"
console.log(date);
