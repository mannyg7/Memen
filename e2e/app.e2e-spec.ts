import { browser, element, by } from 'protractor';

describe('hw6 App', function() {
  it('should register a user', function() {
      browser.get('http://localhost:49152/landing');
      element(by.name('name')).sendKeys("lol4");
      element(by.name('displayName')).sendKeys("Rando");
      element(by.name('email')).sendKeys("lol4@rice.edu");
      element(by.name('phone')).sendKeys("123-123-1234");
      element(by.name('dob')).sendKeys("11-17-1993");
      element(by.name('zipcode')).sendKeys(77777);
      element(by.id('regPassword')).sendKeys("log-rando-in");
      element(by.name('passwordConfirm')).sendKeys("log-rando-in");
      element(by.id('regSubmit')).click();
      expect(browser.getCurrentUrl()).toBe('http://localhost:49152/landing');
   })

   it('should login test user', function() {
      browser.get('http://localhost:49152/landing');
      element(by.name('username')).sendKeys("mrg7");
      element(by.id('loginPassword')).sendKeys("let-me-in");
      element(by.id('loginSubmit')).click();
      expect(browser.getCurrentUrl()).toBe('http://localhost:49152/main');
   })

   it('should create a new article and validate the article appears in the feed', function() {
      browser.get('http://localhost:49152/landing');
      element(by.name('username')).sendKeys("mrg7");
      element(by.id('loginPassword')).sendKeys("let-me-in");
      element(by.id('loginSubmit')).click();
      element(by.id('newArticle')).sendKeys("newArticle");
      element(by.id('post')).click();
      var elem = element(by.css(".something"));
      expect(elem.getText()).toBe("Write a new articlenewArticle");
   })

   it('should edit an article and validate the article text has updated', function() {
      browser.get('http://localhost:49152/landing');
      element(by.name('username')).sendKeys("mrg7");
      element(by.id('loginPassword')).sendKeys("let-me-in");
      element(by.id('loginSubmit')).click();
      element(by.id('newArticle')).sendKeys("newArticle");
      element(by.id('post')).click();
      var elem = element(by.id('editArt'));
      elem.click();
      var elementList2 =  element.all(by.css('.something'));
      var elem2 = elementList2.get(1);
      elem2.sendKeys("new edit")
      var elem1 =  element(by.id('submitArt'));
      elem1.click();
      var elem3 = elementList2.get(0);
      expect(elem3.getText()).toBe("Write a new articlenewArticle new edit");
   })

   it('should update the status headline and verify the change', function() {
      browser.get('http://localhost:49152/landing');
      element(by.name('username')).sendKeys("mrg7");
      element(by.id('loginPassword')).sendKeys("let-me-in");
      element(by.id('loginSubmit')).click();
      element(by.id('txtStatus')).sendKeys("new status");
      element(by.css('.pull-left')).click();
      expect(element(by.id('headline')).getText()).toBe("new status");
   })

   it('should count the number of followed users', function() {
      browser.get('http://localhost:49152/landing');
      element(by.name('username')).sendKeys("mrg7");
      element(by.id('loginPassword')).sendKeys("let-me-in");
      element(by.id('loginSubmit')).click();
      var elementList =  element.all(by.css('.folList'));
      expect(elementList.count()).toBe(0);

   })

   it('should Add the user "Follower" to the list of followed users and verify the count increases by one', function() {
   	  var count: number = 0;
      browser.get('http://localhost:49152/landing');
      element(by.name('username')).sendKeys("mrg7");
      element(by.id('loginPassword')).sendKeys("let-me-in");
      element(by.id('loginSubmit')).click();
      var elementList =  element.all(by.css('.folList'));
      elementList.count().then(value => {
	        count = value;
	    });
      element(by.id('newFollowwer123')).sendKeys("php4");
      element(by.id('addFollower')).click();
      var elementList1 =  element.all(by.css('.folList'));
      elementList1.count().then(value => {
	        expect(value).toBeGreaterThan(count);
	    });
   })

   it('should Remove the user "Follower" from the list of followed users and verify the count decreases by one', function() {
      var count: number = 0;
      browser.get('http://localhost:49152/landing');
      element(by.name('username')).sendKeys("mrg7");
      element(by.id('loginPassword')).sendKeys("let-me-in");
      element(by.id('loginSubmit')).click();
      element(by.id('newFollowwer123')).sendKeys("php4");
      element(by.id('addFollower')).click();
      var elementList =  element.all(by.css('.folList'));
      elementList.count().then(value => {
	        count = value;
	    });
      element(by.css('.delUser12')).click();
      var elementList1 =  element.all(by.css('.folList'));
      elementList1.count().then(value => {
	        expect(value).toBeLessThan(count);
	    });
   })

   it('should Search for Only One Article Like This and verify only one article shows and verify the author', function() {
      browser.get('http://localhost:49152/landing');
      element(by.name('username')).sendKeys("mrg7");
      element(by.id('loginPassword')).sendKeys("let-me-in");
      element(by.id('loginSubmit')).click();
   })

   it('should Navigate to the profile view Update the users email and verify', function() {
      browser.get('http://localhost:49152/landing');
      element(by.name('username')).sendKeys("mrg7");
      element(by.id('loginPassword')).sendKeys("let-me-in");
      element(by.id('loginSubmit')).click();
      element(by.id('profilebutton12')).click();
      element(by.id('email1')).sendKeys("manmi13@gmail.com");
      element(by.id('update123')).click();
      expect(element(by.id('emailP')).getText()).toBe("Email Address: manmi13@gmail.com");
   })

   it('should Navigate to the profile view Update the users zipcode and verify', function() {
      browser.get('http://localhost:49152/landing');
      element(by.name('username')).sendKeys("mrg7");
      element(by.id('loginPassword')).sendKeys("let-me-in");
      element(by.id('loginSubmit')).click();
      element(by.id('profilebutton12')).click();
      element(by.id('zip')).sendKeys("12345");
      element(by.id('update123')).click();
      expect(element(by.id('zipP')).getText()).toBe("Zipcode: 12345");

   })

   it('should Navigate to the profile view Update the users password and verify', function() {
      browser.get('http://localhost:49152/landing');
      element(by.name('username')).sendKeys("mrg7");
      element(by.id('loginPassword')).sendKeys("let-me-in");
      element(by.id('loginSubmit')).click();
      element(by.id('profilebutton12')).click();
      element(by.id('pc')).sendKeys("log-me-in");
      element(by.id('pc12')).sendKeys("log-me-in");
      element(by.id('update123')).click();
      expect(element(by.id('passP')).getText()).toBe("Password: log-me-in");
   })

});
