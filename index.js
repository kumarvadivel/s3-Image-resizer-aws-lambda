//IMPORTS......
const aws= require('aws-sdk');
const sharp = require('sharp');
require('dotenv').config()


//GLOBAL VARIABLE CONTEXTS..........
const DEFAULT_CACHE_HEADER = 'public, max-age=86400';
const accesskey=process.env.ACCESS_KEY;
const secret=process.env.SECRET;
const destination= process.env.DESTINATION_BUCKET_NAME;


//AWS CONFIGURATION........
aws.config.update({
    secretAccessKey: secret,
    accessKeyId: accesskey,
    region: 'us-east-2' //E.g us-east-1
  });

 
//S3 OBJECT CONSTRUCTOR.......
const s3= new aws.S3()


//LAMBDA MAIN FUNCTION .......
//NOTE: PLEASE SPECIFY THE HANDLER NAME AS THIS FUNCTION NAME IN LAMBDA SETTINGS IN THE FORMAT OF  'FILENAME.FUNCTION_NAME'.......
module.exports.handler =  async function(event) {
    console.log("gathering Object information");
    //GATHERING BUCKET NAME......
    let BUCKET_NAME=event.Records[0].s3.bucket.name;
    console.log("BUCKET:",BUCKET_NAME);
    //GATHERING KEY NAME.......
    let KEY_NAME=event.Records[0].s3.object.key;
    console.log("KEY:",KEY_NAME);
    console.log("checking object filetype")
    //CHECKING FILE TYPE VALIDITY BY VALIDATING THE FILE EXTENSION......
    const filevalidity=checkfiletype(KEY_NAME);
    if (!filevalidity){
       return {
            status:400,
            message:"sorry the uploaded object is not the desired image format",
        };
    }
    console.log("checking object filetype - COMPLETED")
    console.log("compressing image.......")
    //GETTING TRIGGERED IMAGE USING THIS FUNCTION........
    const getobject=await getObject(BUCKET_NAME,KEY_NAME);
    if(!getobject){
        return {
            status:400,
            message:"sorry the requested file is not avaliable in the bucket",
        }
    }
    //COMPRESING THE IMAGE USING THIS FUNCTION BY USING SHARP IMAGE COMPRESSION LIBRARY
    const compressedimage=await imageresize(getobject,KEY_NAME)
    if(!compressedimage){
        return {
                status:400,
                message:"Unable to upload optimized image to a Bucket [BUCKET_ERROR]"
        }
    }else{
        return {
                status:200,
                message:`Optimised image uploaded successfully to the bucket : ${KEY_NAME}300X300 [UPLOAD_SUCCESS]`,
                data:compressedimage
        }
    }
}

//FUNCTION TO GET THE OBJECT FROM THE S3 BUCKET ......
async function getObject(bucket,key){
    let params={
        Bucket:bucket,
        Key:key
    }
    return new Promise((resolve,reject)=>{
        s3.getObject(params,(err,data)=>{
                if(err){
                    return resolve(false);
                }else{
                   console.log("io",data);
                    return resolve(data);
                }
            })
    })
}

//FUNCTION TO RESIZE THE IMAGE OBJECT USING SHARP LIBRARY AND WRITING IT BACK TO THE DESTINATION BUCKET
async function imageresize(image,key){
    console.log(image.Body);
    const result = await sharp(image.Body).resize(300,300).toBuffer();
    return new Promise((resolve,reject)=>{
        s3.putObject({
            Bucket:destination,
            Body:result,
            ContentType:'image/jpeg',
            ACL:"public-read",
            CacheControl: DEFAULT_CACHE_HEADER,
            Key:`300X300${key}`
        },(err,data)=>{
            if(err){
                return resolve(false)
            }else{
                return resolve(data);
            }
        })
    })
}

//FUNCTION TO CHECK FILE TYPE OF THE OBJECT.....
function checkfiletype(key){
    if(["jpg","png"].includes(key.split(".")[key.split(".").length-1])){
        return true;
    }else{
        return false;
    }
}

/// DISCLAIMER:THE LINE BELOW THESE LINES ARE NOT INTENDED TO BE THE PART OF THE FUNCTION . THESE LINES ARE MADE PURELY FOR INTERNAL TESTING OF FUNCTION
const test ={
    "Records": [
      {
        "eventVersion": "2.0",
        "eventSource": "aws:s3",
        "awsRegion": "us-east-2",
        "eventTime": "1970-01-01T00:00:00.000Z",
        "eventName": "ObjectCreated:Put",
        "userIdentity": {
          "principalId": "EXAMPLE"
        },
        "requestParameters": {
          "sourceIPAddress": "127.0.0.1"
        },
        "responseElements": {
          "x-amz-request-id": "EXAMPLE123456789",
          "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH"
        },
        "s3": {
          "s3SchemaVersion": "1.0",
          "configurationId": "testConfigRule",
          //REPLACE 'EXAMPLEBUCKET' WITH ACTUAL BUCKET NAME WHICH YOU SET THE TRIGGER TO TEST THE FUNCTION LOCALLY
          "bucket": {
            "name": "EXAMPLEBUCKET",
            "ownerIdentity": {
              "principalId": "EXAMPLE"
            },
            //REPLACE 'EXAMPLEBUCKET' WITH ACTUAL BUCKET NAME WHICH YOU SET THE TRIGGER TO TEST THE FUNCTION LOCALLY
            "arn": "arn:aws:s3:::EXAMPLEBUCKET"
          },
          "object": {
            //REPLACE 'TEST/KEY' WITH ACTUAL KEY NAME WHICH IS PRESENT ALREADY IN THE TRIGGER BUCKET TO TEST THE FUNCTION LOCALLY
            "key": "TEST/KEY",
            "size": 1024,
            "eTag": "0123456789abcdef0123456789abcdef",
            "sequencer": "0A1B2C3D4E5F678901"
          }
        }
      }
    ]
  }
  

  //UNCOMMENT THE BELOW LINE AND RUN THE FILE TO START TESTING IT LOCALLY......
  //DISCLAIMER: COMMENT THE BELOW LINE(line.no:167) BEFORE MOVING THE APP INTO THE PRODUCTION........
  //handler(test)