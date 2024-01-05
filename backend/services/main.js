import dbService from "./dbService";

(async () => {
  const connected = await dbService.isConnected();
  console.log("Connected:", connected); // Will log true/false after connection

  if (connected) {
    console.log("Connection to MongoDB established successfully.");
  }
  console.log('Unsuccessful');
})();