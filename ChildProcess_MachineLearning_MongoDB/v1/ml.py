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
		timestamp_list = []
		tsObj = db.historicdatas.find()
		for ts in tsObj:
			timestamp_list.append(ts["timestamp"])
		ts2dArr = np.array(timestamp_list).reshape(-1,1)
		return ts2dArr

	except Exception as e:
		print(str(e))

def getTemperature():
	try:
		temperature_list = []
		tempObj = db.historicdatas.find()
		for temp in tempObj:
			temperature_list.append(temp.get("json").get("temp"))
		temp2dArr = np.array(temperature_list).reshape(-1,1)
		return temp2dArr

	except Exception as e:
		print(str(e))

def getHumidity():
	try:
		humidity_list = []
		humiObj = db.historicdatas.find()
		for humi in humiObj:
			humidity_list.append(humi.get("json").get("hum"))
		humi2dArr = np.array(humidity_list).reshape(-1,1)
		return humi2dArr

	except Exception as e:
		print(str(e))

def main():
	toPredict = read_in()
	Xtrain_ts = getTimeStamp()
	Ytrain_temp = getTemperature()
	Ytrain_humi = getHumidity()

	regressor1 = LinearRegression()
	regressor2 = LinearRegression()

	regressor1.fit(Xtrain_ts,Ytrain_temp)
	regressor2.fit(Xtrain_ts,Ytrain_humi)

	y_pred_temp = regressor1.predict(toPredict)
	y_pred_humi = regressor2.predict(toPredict)

	strTemp = str(y_pred_temp[0][0])
	strHumi = str(y_pred_humi[0][0])

	print(strTemp + "/" + strHumi)

if __name__ == '__main__':
	main()