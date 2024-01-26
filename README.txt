Project 02 - Coin Tracker
This application will allow users to tracker the gains and loss of cryptos currencies.



Model 1
Users Accounts
Name
Email
Password
Array of Wallets Objects
	Wallet Objects{
		Crypto Name:
		Crypto Amount: 
		Purchase Price:
		Wallet Address:
	}


Model 2:
Crypto Name:
Cyrpto Details:
Exchanges: Array of Exchanges


Model 3
Exchange Name
Exchange Details
Array of Cryptos


APIs
Websockets Binance API
Websockets Coinbase API (After Binance Successful)


LIST OF FEATURES

Users  Accounts:
  Login
  Sign Up/Create Account
  Edit Account
  Delete Account
  Reset Account Password
    Forgot Password	
    Standard Reset

  Add Crypto User Dashboard
  Edit Crypto/s in User Dashboard
  Deleted Crypto from  user Dashboard


Crypto Currencies: 
  Add/Create Crypto to Library 
  List/Read Cryptos in LIbrary 
  List Details of a Crypto
  Edit Crypto in Library 
  Delete Crypto from Library


Exchanges:
  Add/Create Exchange to Library
  List/Read Exchanges in Library
  List Details of an Exchange 
  Edit Exchange in Library
  Delete Exchange from  Library 


RELATIONSHIPS
  Many to Many  - Crypto Currencies and Exchanges