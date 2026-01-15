function filterJobs(jobs, keywords) {
  const keys = keywords.toLowerCase().split(" ");

  return jobs.filter((job) =>
    keys.some((k) => job.title.toLowerCase().includes(k))
  );
}

module.exports = filterJobs;
