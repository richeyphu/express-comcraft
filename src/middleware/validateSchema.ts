import { checkSchema, Schema } from 'express-validator';

import { productCategory } from '@models';
import { BASE64_IMAGE_REGEX } from '@utils';

/*** Login Schema ***/

const userLoginSchema: Schema = {
  email: {
    notEmpty: {
      errorMessage: 'กรุณาป้อนอีเมลด้วย',
    },
    isEmail: {
      errorMessage: 'รูปแบบอีเมลไม่ถูกต้อง',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'กรุณาป้อนรหัสผ่านด้วย',
    },
    isLength: {
      errorMessage: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
      options: { min: 8 },
    },
  },
};

const userRegisterSchema: Schema = {
  name: {
    notEmpty: {
      errorMessage: 'กรุณาป้อนชื่อ-สกุลด้วย',
    },
  },
  email: {
    notEmpty: {
      errorMessage: 'กรุณาป้อนอีเมลด้วย',
    },
    isEmail: {
      errorMessage: 'รูปแบบอีเมลไม่ถูกต้อง',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'กรุณาป้อนรหัสผ่านด้วย',
    },
    isLength: {
      errorMessage: 'รหัสผ่านต้องมีอย่างน้อย 5 ตัวอักษร',
      options: { min: 5 },
    },
  },
};

const userAddressSchema: Schema = {
  name: {
    notEmpty: {
      errorMessage: 'กรุณาป้อนชื่อ-สกุลด้วย',
    },
  },
  tel: {
    notEmpty: {
      errorMessage: 'กรุณาเบอร์โทรศัพท์ด้วย',
    },
  },
  'address.line1': {
    notEmpty: {
      errorMessage: 'กรุณาป้อนที่อยู่ด้วย',
    },
  },
  'address.city': {
    notEmpty: {
      errorMessage: 'กรุณาป้อนที่อยู่ด้วย',
    },
  },
  'address.province': {
    notEmpty: {
      errorMessage: 'กรุณาป้อนที่อยู่ด้วย',
    },
  },
  'address.zip': {
    notEmpty: {
      errorMessage: 'กรุณาป้อนที่อยู่ด้วย',
    },
  },
};

const userLogin = checkSchema(userLoginSchema);
const userRegister = checkSchema(userRegisterSchema);
const userAddress = checkSchema(userAddressSchema);

export { userLogin, userRegister, userAddress };

/*** Product Schema ***/

const productInsertSchema: Schema = {
  name: {
    notEmpty: {
      errorMessage: 'กรุณาป้อนชื่อสินค้า',
    },
  },
  price: {
    notEmpty: {
      errorMessage: 'กรุณาป้อนราคา',
    },
    isNumeric: {
      errorMessage: 'ราคาต้องเป็นตัวเลขเท่านั้น',
    },
  },
  category: {
    isIn: {
      errorMessage: `ประเภทสินค้าไม่ถูกต้อง : ['${[...productCategory].join(
        "', '"
      )}']`,
      options: [[...productCategory, null]],
    },
  },
  photo: {
    matches: {
      errorMessage: 'รูปแบบรูปภาพไม่ถูกต้อง',
      options: [BASE64_IMAGE_REGEX],
    },
  },
};

const productUpdateSchema: Schema = {
  price: {
    isNumeric: {
      errorMessage: 'ราคาต้องเป็นตัวเลขเท่านั้น',
    },
  },
  category: {
    isIn: {
      errorMessage: `ประเภทสินค้าไม่ถูกต้อง : ['${[...productCategory].join(
        "', '"
      )}']`,
      options: [[...productCategory, null]],
    },
  },
  photo: {
    matches: {
      errorMessage: 'รูปแบบรูปภาพไม่ถูกต้อง',
      options: [BASE64_IMAGE_REGEX],
    },
  },
};

const productInsert = checkSchema(productInsertSchema);
const productUpdate = checkSchema(productUpdateSchema);

export { productInsert, productUpdate };
