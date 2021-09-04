import http from 'http';

(() => {
  const request = http.request(
    `http://localhost:${process.env.PORT ?? 1337}/health`,
    (response) => {
      response.on('data', (data) => {
        process.stdout.write(data);
      });

      process.exitCode = response.statusCode === 200 ? 0 : response.statusCode;
    },
  );

  request.on('error', (error) => {
    console.error(error);
    throw error;
  });

  request.end();
})();
