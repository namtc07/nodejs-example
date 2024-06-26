"use strict";

const shopModal = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static logout = async (keyStore) => {
    console.log("keyStore::", keyStore);
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  /*
    1. Check email in dbs
    2. Match password
    3. Create AT vs RT and save
    4. Generate tokens
    5. Get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1.
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered!");

    // 2.
    bcrypt.compare(password, foundShop.password).then((result) => {
      if (!result) throw new AuthFailureError("Authentication error!");
    });

    // 3.
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    // 4.
    const { _id: useId } = foundShop;
    const tokens = await createTokenPair({ useId, email }, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      useId,
    });

    return {
      metadata: {
        shop: getInfoData({ fields: ["_id", "name", "email"], object: foundShop }),
        tokens,
      },
    };
  };

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModal.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModal.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // created privateKey, publicKey
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: keyStore error!");
        // return {
        //   code: "xxx",
        //   message: "keyStore error!",
        // };
      }

      // created token pair
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({ fields: ["_id", "name", "email"], object: newShop }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
