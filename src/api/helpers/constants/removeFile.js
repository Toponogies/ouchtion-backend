import fs from 'fs';

export default async function(file_path)
{
    fs.unlink(file_path, (err) => {
        if (err) {
            console.log(err);
            return console.log(`Error delete file ${file_path}`);
        }
        return console.log(`file ${file_path} deleted`);
    });
}