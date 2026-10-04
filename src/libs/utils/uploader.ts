import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";

/** MULTER IMAGE UPLOADER */
function getTargetImageStorage(address: any) {
    return multer.diskStorage ({
        destination: function(req, file, cb) {
            cb(null, `./uploads/${address}`);
        },
          filename: function(req, file, cb) {
        console.log(file);
        const extension = path.parse(file.originalname).ext;
        const random_name = randomUUID() + extension;
        cb(null, random_name);
    },
    });
}


const makeUploader = (address: string) => {
    const storage = getTargetImageStorage(address);
    return multer ({storage:storage});
};
export default makeUploader;