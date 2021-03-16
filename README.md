# s3-Image-resizer-aws-lambda

lambda function to trigger on s3 object uploads and resize uploaded image in another s3 bucket.


<h1>Tech stack</h1>
<ul>
<li>Node js</li>
<li>javaScript </li>

<h1> How to Run </h1>
<ol>
<li>clone this repository to the system</li>
<li>open the project directory </li>
<li>create a file with ".env" and follow the instructions in the environment variable section</li>
<li>open command line run "npm install" in the folder</li>
<li>then run "node index.js" inside your command line to test it locally (locall testing instructions are mentioned in the code itself)</li>
</ol>
<br>
<b>NOTE:</b> never intent to run open sourced code to production before testing it locally<br>
<h3>production instructions</h3>
<ol>
<li>create a lambda function with a name in "console.aws.com/lambda"</li>
<li>set the trigger in the function as s3 and select the bucket name that you want the trigger</li>
<li>for prodction add the values which given in the environment variables section</li>
<li>now zip all the files inside project directory by selecting all the files inside the directory and compressing it</li>
<li>now upload the zip file to a dummy s3 bucket and copy its object url</li>
<li>now navigate to lambda and click upload option in that select "s3 location" then paste the object url in the popup</li>
<li>save every thing and it is done YaY!!!!</li>
</ol>

<h3>Environment variables</h3>
there are 3 environment variables configured in this function they are:
<ol>
<li><b>ACCESS_KEY</b>: this value is the aws sdk access key provided by aws</li>
<li><b>SECRET</b>: this value is the aws sdk secret key provided for the access key provided by aws</li>
<li><b>DESTINATION_BUCKET_NAME</b>: this value is the destination bucket name value for this function</li>
</ol>
<br>
<br>
<br>

<b> I HOPE MY CODE SOMEHOW SAVED YOUR ASS FROM YOUR BOSS SOMEDAY . IF "YESS" LEAVE A STAR ON MY REPO TO ACKNOWLEDGE MY CODE </b><br>
for further queries mail me down the below address<br>
<b>Email:</b><a href="mailto:kumarvadivel1999@gmail.com">my mail</a>
