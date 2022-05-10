import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testobject.ObjectRepository.findWindowsObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testng.keyword.TestNGBuiltinKeywords as TestNGKW
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

WebUI.openBrowser('')

WebUI.navigateToUrl('https://igdinfo.cloudflareaccess.com/cdn-cgi/access/login/test.igdinfo.com?kid=c87e3b6567546e5cafc7492122b52d54835624b2716e7fb783b4a361989873dc&redirect_url=%2Fhome&meta=eyJraWQiOiJkNWU1Mjk3YzgxZGU5ZGM1OTBkMWMwNDY2OTExNDVmMWNiZWJkODRjMWQ5YTIxNDEyN2MyMTIwMWE4MjEwOGJmIiwiYWxnIjoiUlMyNTYiLCJ0eXAiOiJKV1QifQ.eyJzZXJ2aWNlX3Rva2VuX3N0YXR1cyI6ZmFsc2UsImlhdCI6MTY1MTEyOTA3Mywic2VydmljZV90b2tlbl9pZCI6IiIsImF1ZCI6ImM4N2UzYjY1Njc1NDZlNWNhZmM3NDkyMTIyYjUyZDU0ODM1NjI0YjI3MTZlN2ZiNzgzYjRhMzYxOTg5ODczZGMiLCJob3N0bmFtZSI6InRlc3QuaWdkaW5mby5jb20iLCJ0eXBlIjoibWV0YSIsIm5iZiI6MTY1MTEyOTA3MywicmVkaXJlY3RfdXJsIjoiXC9ob21lIiwiaXNfZ2F0ZXdheSI6ZmFsc2UsImlzX3dhcnAiOmZhbHNlLCJhdXRoX3N0YXR1cyI6Ik5PTkUifQ.KlwF4TNrcX4i40GEM9em5BCLxgh6lUvjxMNw9LVnbimsioT80B4wGrSuLcvtCq54IYgd58IEmTlI9Hl__d4uVOzo2kLtQpagxd0KvGB7_4FBOVL26x_PXPecKdWvbz4WH9SlT1teO8LLH9-TJAfEXCocVilqqnE0EKgQxOdEhe6VuY_uteFWXZgHrhvoFFzLu6Df4c92MA452zEolMvBo33jkeU91Sr3T8ysUbE557Q5hqE6tTDPfLn2XMungs1j-l1mgS7qy6-0sFMnJRtPleRoHRjS2rhR0giljAFLmrQ5CcGJ6809XyLF8n_-Bq0IZKLpnoBzDtPwr25X5daG8w')

WebUI.click(findTestObject('Object Repository/cloud flare/Page_Sign in  Cloudflare Access/a_Azure AD  Azure AD'))

WebUI.setText(findTestObject('Object Repository/cloud flare/Page_Sign in to your account/input_Sign in_loginfmt'), 'minhthong.it2015@gmail.com')

WebUI.click(findTestObject('Object Repository/cloud flare/Page_Sign in to your account/input_Sign in_idSIButton9'))

WebUI.setEncryptedText(findTestObject('Object Repository/cloud flare/Page_Sign in to your Microsoft account/input_Enter password_passwd'), 
    'D1teYgHESOyfzObCVrRa7dZ2jHx4aqmo')

WebUI.click(findTestObject('Object Repository/cloud flare/Page_Sign in to your Microsoft account/input_Forgot password_idSIButton9'))

WebUI.click(findTestObject('Object Repository/cloud flare/Page_Microsoft account/input_concat(Stay signed in so you don, , t_4104e6'))

WebUI.click(findTestObject('Object Repository/cloud flare/Page_Microsoft account/input_concat(Don, , t show this again)_idSIButton9'))

WebUI.closeBrowser()

