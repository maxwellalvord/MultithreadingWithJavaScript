// // Example of PCU intensive task
// const start = performance.now();

const jobs = Array.from({ length: 100 }, () => 1e9);

// for (let job of jobs) {
//   let count = 0;
//   for(let i = 0; i < job; i++) {
//     count++;
//   }
// }

// const end = performance.now();
// console.log(`Main thread took ${end - start} ms`);

const { Worker } = require('worker_threads');

function chunkify(array, n) {
  let chunks = [];
  for ( let i = n; i > 0; i--) {
    chunks.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return chunks;
}

function run(jobs, concurrentWorkers) {
  const chunks = chunkify(jobs, concurrentWorkers);

  const start = performance.now();
  let completedWorkers = 0;

  chunks.forEach((data, i) => {
    const worker = new Worker("./worker.js");
    worker.postMessage(data);
    worker.on("message", () => {
      console.log(`Worker ${i} completed`);
      completedWorkers++;
      if (completedWorkers === concurrentWorkers) {
        console.log(
          `${concurrentWorkers} works took ${performance.now() - start}`
        );
        process.exit();
      }
    });
  });
}

run(jobs, 12)