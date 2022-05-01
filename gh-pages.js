var ghpages = require("gh-pages");

ghpages.publish(
  "public", // path to public directory
  {
    branch: "gh-pages",
    repo: "https://github.com/tom1dot618/CCtrader.git", // Update to point to your repository
    user: {
      name: "tom1dot618", // update to use your name
      email: "tom1dot618@gmail.com", // Update to use your email
    },
  },
  () => {
    console.log("Deploy Complete!");
  }
);
