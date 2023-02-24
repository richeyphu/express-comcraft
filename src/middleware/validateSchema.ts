import { checkSchema, Schema } from 'express-validator';

import { userRole, productCategory } from '@models';
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
      errorMessage: 'รหัสผ่านต้องมีอย่างน้อย 5 ตัวอักษร',
      options: { min: 5 },
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
  role: {
    isIn: {
      errorMessage: 'ประเภทผู้ใช้ไม่ถูกต้อง',
      options: [[...userRole], null],
    },
  },
};

const userLogin = checkSchema(userLoginSchema);
const userRegister = checkSchema(userRegisterSchema);

export { userLogin, userRegister };

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
