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

WebUI.navigateToUrl('https://pandoraboz-staging.herokuapp.com/sign-in')

WebUI.setText(findTestObject('Object Repository/test/Page_ng Nhp/input_a ch email_email'), 'minhthong.it2015@gmail.com')

WebUI.setEncryptedText(findTestObject('Object Repository/test/Page_ng Nhp/input_Mt khu_password'), 'ZNxgWI6xCqD8O8hfZq3//g==')

WebUI.click(findTestObject('Object Repository/test/Page_ng Nhp/span_ng Nhp'))

WebUI.click(findTestObject('Object Repository/test/Page_Pandoras Boz/span_Facebook Bots'))

WebUI.delay(5)

WebUI.switchToWindowTitle('Facebook Bots')

WebUI.click(findTestObject('Object Repository/test/Page_Facebook Bots/span_Mac'))

WebUI.delay(5)

WebUI.switchToWindowTitle('Facebook Bots')

WebUI.click(findTestObject('Object Repository/test/Page_Facebook Bots/a_Mac'))

WebUI.delay(5)

WebUI.switchToWindowTitle('Facebook Bots')

WebUI.closeBrowser()

