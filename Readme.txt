We are using csv to json module to convert csv data which is in excel to json format.
After converting, we have to import the data, using the post method we are directly importing the data.
After importing the data, we are retreiving it from req.query using the get method 
In get method, we are retriving the values in the specified date mentioned in the request.

Task:
Create API ‘/analytics’ 
Pramas 
		
Date – type of array [’1-10-2020’, ’20-10-2020’]
			
 Metric – type of string ‘cpu’ or ‘memory’
			
Aggr – type of string ‘P90’ or ‘AVG’

Output testing:	(Check in Postman)
http://localhost:3000/analytics?date='2019-03-01, 2020-03-03'&metric=Memory&Aggr=P90


	
Create API ‘/bad-performance’
Pramas
Date – type of array [’1-10-2020’, ’20-10-2020’]

Output testing:	(Check in Postman)
http://localhost:3000/analytics?date='2019-03-01, 2020-03-03'&metric=Memory&Aggr=P90