'use strict';

var AWS, CronJob, app, express, http, path, port, server, Tabletop;

AWS = require('aws-sdk');
CronJob = require('cron').CronJob;
Tabletop = require('tabletop');


function writeJsonToAmazon(array){
	var s3 = new AWS.S3();

	var params = {
		Bucket: 'yellow-flyers-data',
		ACL: 'public-read',
		Key: 'flyers.json',
		ContentType: 'application/javascript',
		Body: JSON.stringify(array)
	};

	s3.putObject(params, function(err, data){
		if (err){
			console.log(err);
		}
		else{
			console.log('flyers.json updated');
		}
	});
}

//updates data

function updateData(){

	Tabletop.init({
		key: '1v-aQYwpoUJEcopld4DsYafoOuDXIgJfPepuWwQcd2RY',
		callback: function(data){
			console.log(data);
			writeJsonToAmazon(data);
		}
	});

}

updateData();

//scheduled tasks

new CronJob('00-60/30 * * * * *', function() {

  // ...and every minute afterwards

  updateData();

}, null, true);