module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/icon-cloud/" : "/",
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/styles/_variables.scss";
        `
      }
    }
  }
};
