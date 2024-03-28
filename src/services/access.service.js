"use strict";

const shopModal = require("../models/shop.modal");

class AccessService {
  static signUp = async () => {
    try {
      // step1: check email exists?
      const holderShop = await shopModal.findOne({ email }).lean();

      if (holderShop) {
      }
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
