import { Builder, By, until } from "selenium-webdriver";

(async function exampleTest() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:4173"); // or your dev/preview URL
    await driver.wait(until.titleContains("Canteen"), 5000);

    const body = await driver.findElement(By.tagName("body"));
    const text = await body.getText();

    if (!text.toLowerCase().includes("canteen")) {
      throw new Error("Canteen text not found on page");
    }

    console.log("Test passed");
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  } finally {
    await driver.quit();
  }
})();