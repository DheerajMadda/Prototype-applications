import sys,json,numpy as np
from sklearn.linear_model import LinearRegression
from pymongo import MongoClient
client = MongoClient('localhost:27017')
db = client.dheeraj

def read_in():
	lines = sys.stdin.readlines()
	return np.array(int(json.loads(lines[0]))).reshape(-1,1)

def getTimeStamp():
	try:
		tsObj = db.historicdatas.find()
		return np.array([ts["timestamp"] for ts in tsObj]).reshape(-1,1)

	except Exception as e:
		return np.array(None)

def getTemperature():
	try:
		tempObj = db.historicdatas.find()
		return np.array([temp.get("json").get("temp") for temp in tempObj]).reshape(-1,1)

	except Exception as e:
		return np.array(None)

def getHumidity():
	try:
		humiObj = db.historicdatas.find()
		return np.array([humi.get("json").get("hum") for humi in humiObj]).reshape(-1,1)

	except Exception as e:
		return np.array(None)

def main():
	toPredict = read_in()
	Xtrain_ts = getTimeStamp()
	Ytrain_temp = getTemperature()
	Ytrain_humi = getHumidity()

	if ((Xtrain_ts.any() and Ytrain_temp.any() and Ytrain_humi.any()) != None ):
		regressor1 = LinearRegression()
		regressor2 = LinearRegression()

		regressor1.fit(Xtrain_ts,Ytrain_temp)
		regressor2.fit(Xtrain_ts,Ytrain_humi)

		y_pred_temp = regressor1.predict(toPredict)
		y_pred_humi = regressor2.predict(toPredict)

		strTemp = str(y_pred_temp[0][0])
		strHumi = str(y_pred_humi[0][0])

		print(strTemp + "/" + strHumi)
		
	else:
		print(str(None))

if __name__ == '__main__':
	main()