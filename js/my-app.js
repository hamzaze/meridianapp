Template7.registerHelper('stringify', function (context){
    var str = JSON.stringify(context);
    // Need to replace any single quotes in the data with the HTML char to avoid string being cut short
    return str.split("'").join('&#39;');
});

Template7.registerHelper('if_compare', function (a, operator, b, options) {
    var match = false;
    if (
        (operator === '==' && a == b) ||
        (operator === '===' && a === b) ||
        (operator === '!=' && a != b) ||
        (operator === '>' && a > b) ||
        (operator === '<' && a < b) ||
        (operator === '>=' && a >= b) ||
        (operator === '<=' && a <= b)
        ) {
        match = true;
    }
    if (match) return options.fn(this);
    else return options.inverse(this);
});

// Initialize your app
var myApp = new Framework7({
    precompileTemplates: true,
    template7Pages: true, // need to set this
    cache: false
});
 
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
 
// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

var isAjaxLoaded=false;
var isAjaxLoadedLoop=false;
var pathToAjaxDispatcher="http://www.meridianleadershipconference.com/php/ajaxDispatcher.php";
var reloadDiscussionEvery=10000;
var autoloadWelcomeTemplateEvery=1000*60*3;

var akaLocalStorageWelcomeTemplate=null;


var photoNavbarTemplate='<div class="navbar"> \
    <div class="navbar-inner"> \
        <div class="left sliding"> \
            <a href="#" class="link close-popup photo-browser-close-link {{#unless backLinkText}}icon-only{{/unless}} {{js "this.type === \'page\' ? \'back\' : \'\'"}}"> \
                <i class="icon icon-back {{iconsColorClass}}"></i> \
                {{#if backLinkText}}<span>{{backLinkText}}</span>{{/if}} \
            </a> \
        </div> \
        <div class="center sliding text-center">Map</div> \
    </div> \
</div>';


if(!checkCookie()){
    mainView.router.load({
        template: Template7.templates.loginTemplate,
        animatePages: false,
        reload: false
    }); 
    $$("#splashScreen").addClass("passive");
    window.setTimeout(function(){
        $$("#splashScreen").remove();
    }, 1000);
}else{
    if(localStorage.getItem('welcomeTemplate')===null){
        mainView.router.load({
            template: Template7.templates.loginTemplate,
            animatePages: false,
            reload: false
        });
        $$("#splashScreen").addClass("passive");
                            window.setTimeout(function(){
                                $$("#splashScreen").remove();
                            }, 1000);
    }else{
        var token = getCookie("hhUserLoggedInApp");
        if(!checkIsUserStillLoggedIn(getCookie("hhUserLoggedInApp"))){
            mainView.router.load({
                template: Template7.templates.loginTemplate,
                animatePages: false,
                reload: false
            });
        }else{
            var data=JSON.parse(localStorage.getItem('welcomeTemplate'));
            mainView.router.load({
                template: Template7.templates.welcomeTemplate,
                animatePages: false,
                reload: false,
                context: data
            });
        }
    }
}

var DP = (typeof DP === "object") ? DP : {};

$$.fn.checkFields = function(){
    var formName=$$(this).attr("id");
    var $this=$$(this);
    switch(formName){
        default:    
        var vl = new DP.validateForm();
        vl.valSetting = {fields : [
                {id : "context", val : "", msg : "What is this form for?", type : ""}
                ]
        };	  
        return vl.runCheck(formName);
        break;
        case "frmLoginFEUser":    
            var vl = new DP.validateForm();
            vl.valSetting = {fields : [
                    {id : "aEOE_email", val : "", msg : "Type a valid email address", type : "email"},
                    {id : "aEOE_password", val : "", msg : "Type a valid password", type : "password"}
                    ]
            };	  
            return vl.runCheck(formName);
        break;
        case "frmForgotPassword":    
            var vl = new DP.validateForm();
            vl.valSetting = {fields : [
                    {id : "aEOE_email", val : "", msg : "Type a valid email address", type : "email"}
                    ]
            };	  
            return vl.runCheck(formName);
        break;
        
        case "frmAddNewPostToTopic":    
            var vl = new DP.validateForm();
            vl.valSetting = {fields : [
                    {id : "aEOE_content", val : "", msg : "Type something", type : ""}
                    ]
            };	  
            return vl.runCheck(formName);
        break;
    }
};

DP.validateForm = function(){
    //generic check value method
    var formValidated = function(whatForm){	
        if(typeof(whatForm)!="undefined"){
                isfrmAddEditUserSubmit=true;
                 whatForm.submit();	
                 return true;
        }
    };
	
    var fromReset = function(elmId, wrongValue, messageText){
        //reset
        $$(".from_wrp input").css({"border":"1px solid #ACA69F"});
        $$(".from_wrp select").css({"border":"1px solid #ACA69F"});
        $$("#error_messages").empty("");
    }

    //generic check value method
    var valueCheck = function(elmId, wrongValue, messageText){
        if($$("[name='" + elmId + "']").val() == wrongValue){
            createAlert(elmId, messageText);
			return false;
		}
			removeAlert(elmId);
			return true;
    };
    
    //alert method
    var createAlert = function(elmId, messageText){
		elmId.addClass("missingField");
        stringAlert +="<p>" + messageText + "</p>";
    };
    var removeAlert = function(elmId){
            elmId.removeClass("missingField");
    };

    //zip validation
    var isZip = function(s){
        var reZip = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
        if (!reZip.test(s)) {
            return false;
        }
        return true;
    };
    
    //checks if value is integer
    var isInt = function(n){
        var reInt = new RegExp(/^\d+$/);
        if (!reInt.test(n)) {
            return false;
        }
        return true;
    };
    
    //checks if value is pin
    var isPin = function(n){
        var rePin = new RegExp(/^\w{4,8}$/);
        if (!rePin.test(n)) {
            return false;
        }
        return true;
    };
    
    //checks if value is pin2
    var isPin2 = function(n){
        var rePin2 = new RegExp(/^\w{8,24}$/);
        if (!rePin2.test(n)) {
            return false;
        }
        return true;
    };
	//checks if value is integer
    var isPrice = function(n){
        var rePrice = new RegExp(/^\d+($|\,\d{3}($|\.\d{1,2}$)|\.\d{1,2}$)/);
        if (!rePrice.test(n)) {
            return false;
        }
        return true;
    };
	
	//mail validation
    var isMail = function(s, elmId){
        var reMail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!reMail.test(s)) {
            return false;
        }		
        return true;
    };
    
    	//checks if value is password
    var isPassword = function(n){
        var rePassword = new RegExp(/^[\w!!?]{6,18}$/);
        if (!rePassword.test(n)) {
            return false;
        }
        return true;
    };
    
    
    //public method checks fieds
    //requires 'valSetting' setting object
	
    this.runCheck = function(whatForm){
        //reseet form		
        //run checks
		var countTrueFilled=0;
		
		stringAlert="<h3>Required fields</h3>";
        for (i=0;i<this.valSetting.fields.length;i++){
			var fName=this.valSetting.fields[i].id;
			var fVal=this.valSetting.fields[i].val;
			var fieldName=$$("#"+whatForm).find("[name='" + this.valSetting.fields[i].id + "']");
                        var fMessage=this.valSetting.fields[i].msg==""?fieldName.closest("div").find("label").text():this.valSetting.fields[i].msg;
            
            if(this.valSetting.fields[i].type == "zip"){
                //zip check
                if(isZip(fieldName.val()) == false){    
                    createAlert(fieldName, this.valSetting.fields[i].msg);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }
            else if (this.valSetting.fields[i].type == "number"){
                //checks for number
                if(isInt(fieldName.val()) == false || fieldName.val()==fVal){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }
			else if (this.valSetting.fields[i].type == "price"){
                //checks for number
                if(isPrice(fieldName.val()) == false){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }else if (this.valSetting.fields[i].type == "pin"){
                //checks for number
                if(isPin(fieldName.val()) == false){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }else if (this.valSetting.fields[i].type == "pin2"){
                //checks for number
                if(isPin2(fieldName.val()) == false){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }else if (this.valSetting.fields[i].type == "password"){
                //checks for number
                if(isPassword(fieldName.val(), fName) === false){ 
                    createAlert(fieldName, fMessage);
                }
				else{
                                    if(fName=='aEOE_passwordagain'){
                                        if(fieldName.val()!=$$("input[name='aEOE_password']").val()) createAlert(fieldName, "Passwords must match.");
                                        else{
                                           removeAlert(fieldName);
                                            countTrueFilled++; 
                                        }
                                    }else{
                                        removeAlert(fieldName);
                                        countTrueFilled++;
                                    }
					
				}
            }
			else if (this.valSetting.fields[i].type == "email"){
                //checks for number
                if(isMail(fieldName.val(), fName) == false){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }
            else{
                //checks for value
                if(fieldName.val()==fVal){
                    createAlert(fieldName, fMessage);
                }else{
                    removeAlert(fieldName);
                    countTrueFilled++;
		}
            }
        }
		if(countTrueFilled>=this.valSetting.fields.length)
		{
			switch(whatForm){
				default:
                                    if(whatForm=="frmUserExperienceSurvey"){
                                        //Check all survey questions answered, otherwise do not submit the survey
                                        if(!handleWithSurveyForm($$("#"+whatForm))){
                                            return false;
                                        }
                                    }
                                    
                                    
                                    if(isAjaxLoaded) return false;
                                    isAjaxLoaded=true;
                                    var postData=myApp.formToJSON("#"+whatForm);
                                    
                                    $$.ajax({
                                       type: "POST",
                                       url: pathToAjaxDispatcher,
                                       data: postData,
                                       dataType: "json",
                                       success: function(data){
                                           isAjaxLoaded=false;
                                           if(whatForm!="frmEditProfile" && whatForm!="frmUserExperienceSurvey" && whatForm!="frmUserExperiencePoll"){
                                                resetForm($$("#"+whatForm));
                                            }
                                               if(data["success"]==1){
                                                    if(whatForm=="frmLoginFEUser"){
                                                        setCookie("hhUserLoggedInApp", data["token"], 7);
                                                        localStorage.setItem('welcomeTemplate', JSON.stringify(data));
                                                        mainView.router.load({
                                                            template: Template7.templates.welcomeTemplate,
                                                            context: data
                                                        });
                                                        if(!data["results"]["profilephoto"]){
                                                            window.setTimeout(function(){
                                                                myApp.popover('.popover-ifnoprofilephoto', $$("#preview"), true);
                                                                window.setTimeout(function(){
                                                                    myApp.closeModal('.popover-ifnoprofilephoto', true);
                                                                }, 6000);
                                                            }, 300);
                                                    }
                                                    }else if(whatForm=="frmForgotPassword"){
                                                        displayInfo(data["message"], $$("body"));
                                                    }else if(whatForm=="frmEditProfile"){
                                                        $$("#topHeader [data-target='myprofile']").attr("data-context", JSON.stringify(data["profile"]));
                                                        displayInfo(data["message"], $$("body"));
                                                    }else if(whatForm=="frmAddNewPostToTopic"){
                                                        $$("#wrapTopicTextHolder").removeClass("activated").find("textarea").val("");
                                                        $$("#wrapDiscussionPosts > div.bodytext").append($$(data["content"]));
                                                        window.setTimeout(function(){
                                                            var targetItem=$$("#wrapDiscussions [data-target='topiclist'][data-id='"+data["topicid"]+"']");
                                                            var newCounter=parseInt(targetItem.attr("data-count"));
                                                            newCounter +=1;
                                                            targetItem.attr("data-counter", newCounter).find("span[data-target='topiclist']").text(newCounter);
                                                            $$('.page-content').scrollTop($$("#wrapDiscussionPosts > div.bodytext").height(), 300);
                                                        }, 200);
                                                        
                                                    }else if(whatForm=="frmEditUserNote"){
                                                        $$("#wrapTopicTextHolder").removeClass("activated").find("textarea").val("");
                                                        $$("#wrapUserNotes > div.bodytext").html(data["content"]);
                                                        
                                                        $$("#wrapUserNotes li.swipeout[data-id='"+data["editid"]+"']").html("").append($$(data["item"]));
                                                        
                                                        
                                                    }else if(whatForm=="frmUserExperienceSurvey"){
                                                        displayInfo(data["message"], $$("body"));
                                                        $$("#"+whatForm).closest("div.page.page-on-center").find("#topHeader a[data-templatename='welcomeTemplate']").click();
                                                    }else if(whatForm=="frmAddNewAgendaQuestion"){
                                                        displayInfo(data["message"], $$("body"));
                                                         $$("#wrapAgendaQuestions div[data-target='questionlist']").html(data["content"]);
                                                    }else if(whatForm=="frmUserExperiencePoll"){
                                                        //alert("request succeed!");
                                                        $$("#wrapPieChart").attr("data-countoptions", data["countoptions"]);
                                                        $$("#wrapPieChart #myChart").html("");
                                                        $$("#wrapPieChart").find("div.pieChartTextIntro").find("div.text-primary").html("n="+data["countusersvoted"]);
                                                        $$("[data-target='polloptions']").attr("data-countoptions", data["countoptions"]).html(data["content"]);
                                                        drawPieChart(data["results"], $$("#wrapPieChart #myChart")[0].getContext("2d"));
                                                        window.setTimeout(function(){
                                                             $$("[data-target='polloptions']").addClass("activated");
                                                        }, 200);
                                                        
                                                        
                                                        
                                                        
                                                    $$("div.page-on-left #wrapPolls a[data-target='topiclist'][data-id='"+data["editid"]+"']").attr("data-context", JSON.stringify(data["results1"])).find("div.item").attr("data-answered", "1");                                               
                                            
                                            window.setTimeout(function(){
                                                    $$("#topHeader div.refreshPoll").removeClass("fadeOutRight").addClass("fadeInRight");
                                            }, 10000);
                                                    }
                                               }else{ 
                                                   if(whatForm=="checkIsUserLoggedIn"){
                                                       if(data["success"]==6){
                                                           displayAlert(data["message"], $$("body"));
                                                       }
                                                   }else{
                                                        displayAlert(data["message"], $$("body"));
                                                    }
                                               }
                                            return false;
                                       }, error: function(error){
                                           resetForm($$("#"+whatForm));
                                           displayAlert("Error. Look at the console log for more informations.", $$("body"));
                                           console.log(error.responseText);
                                           isAjaxLoaded=false;
                                       }
                                    });
				break;
			}
		}
		else
		{
                    displayAlert(stringAlert, $$("body"));
                    return false;
		}
		
    };
	
	
};

$$.fn.clickOff = function(callback, selfDestroy) {
    var clicked = false;
    var parent = this;
    var destroy = selfDestroy || true;
    
    parent.click(function() {
        clicked = true;
    });
    
    $$(document).click(function(event) { 
        if (!clicked) {
            callback(parent, event);
        }
        if (destroy) {
            //parent.clickOff = function() {};
            //parent.off("click");
            //$(document).off("click");
            //parent.off("clickOff");
        };
        clicked = false;
    });
};

$$.fn.detectWithScroll=function(){
    return this.each(function(){
        var $this=$$(this);
        var div=$$("#wrapCurrentAlphabetHere");
        var $hHeight=parseInt($$("#topHeader").outerHeight());
        var arrShowOnce=new Array();
        var arrDataAnchors=new Array();
        var arrTop=new Array();
        var alphabetDiv=$this.find("div.wrappAlphabetBlock");
        
        $$(document).on("scroll", ".page-content", function(){
            alphabetDiv.each(function(){
                var $this2=$$(this);
                var alphabetDivTop=parseInt($this2.offset().top);
                    if(alphabetDivTop-$hHeight<0){
                        var currActiveLetter=$this2.attr("data-alphabet");
                        div.find("[data-target='currentLetter']").text(currActiveLetter);
                    }
            });
         }, true);
        
    });
};

$$.fn.detectWithScroll1=function(){
    return this.each(function(){
        var $this=$$(this);
        var div=$$("#wrapTopAgendaDates");
        var divDates=parseInt(div.outerHeight());
        var $hHeight=parseInt($$("#topHeader").outerHeight());
        var arrShowOnce=new Array();
        var arrDataAnchors=new Array();
        var arrTop=new Array();
        var alphabetDiv=$this.find("div.wrapSingleAgendaDateBlock");
        
        var diffHeight=divDates+$hHeight+4;
        
        $$(document).on("scroll", ".page-content", function(){
            var divTop=parseInt($$("#wrapAgendas").offset().top);
            var divHeight=parseInt($$("#wrapAgendas").height());
            var mainHeight=parseInt($$("div.page-content").outerHeight());
            
            
            alphabetDiv.each(function(){
                var $this2=$$(this);
                var alphabetDivTop=parseInt($this2.offset().top);
                    if(alphabetDivTop-diffHeight<=0){
                        var currDate=$this2.attr("data-ddate");
                        div.find(".flex1").removeClass("activated");
                        div.find(".flex1[data-ddate='"+currDate+"']").addClass("activated");
                    }
            });
            if(divHeight+divTop-mainHeight<=20){
                div.find(".flex1").removeClass("activated");
                div.find(".flex1:last-child").addClass("activated");
            }
         }, true);
        
    });
};

function displayAlert(a, b){
    var c=arguments[2]?arguments[2]:null;
    myApp.modal({
        text: a,
        title: 'Error!',
        buttons: [ 
           {
              text: 'Ok', 
              bold: true,
              onClick: function(){ 
                  if(c!==null){
                      $$(c).focus().val("");
                  }
              }
           } 
        ]
    });
}

function displayInfo(a, b){
    myApp.modal({
        text: a,
        title: 'Success!',
        buttons: [ 
           {
              text: 'Ok', 
              bold: true,
              onClick: function(){ }
           } 
        ]
    });
}

function displayPromptForUserNote($this){
    myApp.prompt('Please give a title to this note.', 'New Note', function (value) {
            if(value!=""){
                $this.attr("data-sentonce", 1);
                $this.attr("data-title", value);
                window.setTimeout(function(){
                    $this.trigger("click");
                }, 300);
                
                
            }else{
                myApp.alert("Note title is required", "Error", function(){
                    displayPromptForUserNote();
                });
            }
        });
}

function resetForm(form){
    form.find("input[type=text], input[type=number], textarea").val("");
    form.find("div.submit-input").addClass("hidden");
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var username = getCookie("hhUserLoggedInApp");
    if (username != "") {
        return true;
    } else {
        return false;
    }
}

function handleWithSurveyForm(form){
    return true;
    var sCount=Number(0);
    sCount +=parseInt(form.find("[data-type='surveyquestion']").filter(function(index, el){
        return $$(this).attr("data-answertype") > 0;
    }).length);
    
    var rating1Count=parseInt(form.find("[data-type='surveyquestion'][data-answertype='1']").find("input.mf-radio:checked").length);
    var rating2Count=parseInt(form.find("[data-type='surveyquestion'][data-answertype='2']").find("input.mf-radio:checked").length);
    var rating3Count=parseInt(form.find("[data-type='surveyquestion'][data-answertype='3']").find("select.mf-select").filter(function(){
        return $$(this).val() > 0;
    }).length);

    var allFields=rating1Count+rating2Count+rating3Count;
    
    console.log("rating1Count="+rating1Count+" ; rating2Count="+rating2Count+" ; rating3Count="+rating3Count);
    if(allFields-sCount>=0){
        return true;
    }else{
        var whatAnchor=form.find("[data-type='surveyquestion']").eq(0).attr("data-anchor");
        form.find("[data-type='surveyquestion']").each(function(){
            var $this=$$(this);
            $this.removeClass("btn-danger");
            switch(parseInt($this.attr("data-answertype"))){
                case 1:
                case 2:    
                    if($this.find("input.mf-radio:checked").length<1){
                        whatAnchor=$this.attr("data-anchor");
                        return false;
                    }
                break;
                case 3:
                    if($this.find("select.mf-select").val()<=0){
                        whatAnchor=$this.attr("data-anchor");
                        return false;
                    }
                break;
            }
        });
        var whatTop=parseInt(form.find("[data-type='surveyquestion'][data-anchor='"+whatAnchor+"']").offset().top);
        
        form.find("[data-type='surveyquestion'][data-anchor='"+whatAnchor+"']").addClass("btn-danger");
        $$('.page-content').scrollTop(whatTop, 300);
        displayAlert("To proceed you must answer all questions.", $$("body"));
        return false;
    }
}



$$(document).on("submit", "form[data-action='handlewithform']", function(e){
    e.preventDefault();
    $$(this).checkFields();
    return false;
});

$$(document).on("click", "[data-action='pollitem']", function(e){
    var $this=$$(this);
    $$("#topHeader div.refreshPoll").removeClass("fadeInRight").addClass("fadeOutRight");
    $this.closest("form[data-action='handlewithform']").checkFields();
});

$$(document).on("click", "a[data-action='togglemenu']", function(e){
    e.preventDefault();
    var $this=$$(this);
    $$($this.attr("data-target")).toggleClass("activated");
});

$$(document).on("click", "a[data-action='toggleform']", function(e){
    e.preventDefault();
    var $this=$$(this);
    if($this.attr("data-animateway")==1){
        $$("div.wrapLoginForms").removeClass("fadeInUp fadeInDown").addClass("fadeOutUp");
        $$($this.attr("data-target")).removeClass("fadeOutUp fadeOutDown").addClass("fadeInUp");
    }else{
        $$("div.wrapLoginForms").removeClass("fadeInUp fadeInDown").addClass("fadeOutDown");
        $$($this.attr("data-target")).removeClass("fadeOutUp fadeOutDown").addClass("fadeInDown");
    }
});

$$(document).on("click", "a[data-action='back']", function(e){
    e.preventDefault();
    var $this=$$(this);
    var templateName=$this.attr("data-templatename");
    if(localStorage.getItem(templateName)===null){
        mainView.router.load({
            template: Template7.templates.loginTemplate,
            animatePages: false,
            reload: false
        });
    }else{
        var data=JSON.parse(localStorage.getItem(templateName));
        mainView.router.load({
            template: Template7.templates.welcomeTemplate,
            animatePages: true,
            reload: false,
            context: data
        });
    }
});


$$(document).click(function(e){
    var target=e.target;
    if($$("#wrapTopicTextHolder").length>0){
        if($$(target).closest("#wrapTopicTextHolder").length<1 && $$(target).closest(".modal").length<1){
            $$("#wrapTopicTextHolder").removeClass("activated");
        }
    }
    if($$("#wrapQuestionTextHolder").length>0){
        if($$(target).closest("#wrapQuestionTextHolder").length<1 && $$(target).closest(".modal").length<1){
            $$("#wrapQuestionTextHolder").removeClass("activated");
        }
    }
});

$$(document).on("click", "[data-action='joindiscussion']", function(e){
    e.preventDefault();
    var $this=$$(this);
    $$($this.attr("data-target")).addClass("activated");
});

$$(document).on("click", "[data-action='scrolltoagendalist']", function(e){
    e.preventDefault();
    var $this=$$(this);
    var ddate=$this.attr("data-ddate");
    $this.closest("div.wrapTopAgendaDates").find(".flex1").removeClass("activated");
    $this.addClass("activated");
    
    var moveTop=Number(0);
    
    var curIndex=$$("div.wrapSingleAgendaDateBlock[data-ddate='"+$this.attr("data-ddate")+"']").index();
    $$("div.wrapSingleAgendaDateBlock[data-ddate='"+$this.attr("data-ddate")+"']").prevAll().each(function(){
        moveTop +=$$(this).outerHeight();
    });
   
    window.setTimeout(function(){
      $$('.page-content').scrollTop(moveTop, 300);
    }, 300);
});

$$(document).on("click", "#menu a", function(){
    window.setTimeout(function(){
        $$("#menu").removeClass("activated");
    }, 500);
});

$$(document).on("click", "a[data-action='markalert']", function(e){
    e.preventDefault();
    var $this=$$(this);
    $this.find("div.item").addClass("viewed");
    
    if(isAjaxLoaded) return false;
    isAjaxLoaded=true;
    var postData={id: $this.attr("data-id"), context: "markAlertAsViewedFE"};
    
    $$.ajax({
       type: "POST",
       url: pathToAjaxDispatcher,
       data: postData,
       dataType: "json",
       success: function(data){
           isAjaxLoaded=false;
               if(data["success"]==1){
                   
               }else{
                   displayAlert(data["message"], $$("body"));
               }
            return false;
       }, error: function(){
           isAjaxLoaded=false;
       }
    });
    
});

document.ontouchmove = function(e) {
    e.stopPropagation();
};

$$(document).on("click","a.swipeout-nodelete", function(e){
    e.preventDefault();
    var $this=$$(this);
    
    if(isAjaxLoaded) return false;
    isAjaxLoaded=true;
    
    var postData={context: $this.attr("data-context")};
    if($this.attr("data-id")){
        postData["id"]=$this.attr("data-id");
    }
    
    $$.ajax({
       type: "POST",
       url: pathToAjaxDispatcher,
       data: postData,
       dataType: "json",
       success: function(data){
           isAjaxLoaded=false;
               if(data["success"]==1){
                   myApp.swipeoutDelete($this.closest("li.swipeout"));
               }else{
                   displayAlert(data["message"], $$("body"));
               }
            return false;
       }, error: function(){
           isAjaxLoaded=false;
       }
    });
});


$$(document).on("click", "a[data-action='addedititem']", function(e){
    e.preventDefault();
    var $this=$$(this);
    
    if($this.attr("data-context")=="wrapAddNewUserNote"){
        if($this.attr("data-sentonce")==0){
            displayPromptForUserNote($this);
            return false;
        }
    }
    
    $this.closest(".flip-container").addClass("hover");
    
    
    
    if(isAjaxLoaded) return false;
    isAjaxLoaded=true;
    var postData={context: $this.attr("data-context")};
    if($this.attr("data-href")){
        postData["href"]=$this.attr("data-href");
    }
    if($this.attr("data-id")){
        postData["id"]=$this.attr("data-id");
    }
    if($this.attr("data-title")){
        postData["title"]=$this.attr("data-title");
    }
    if(postData["context"]=="wrapPollStatisticByOptions"){
        $this.addClass("spinner");
    }
    if(postData["context"]=="wrapCustomPage"){
        $$(".views").addClass("overflow");
        $$("#superTransitionEffect").css({"background-color": $this.attr("data-bgcolor")}).addClass("bigCircleForTransition");
    }
    
    $$.ajax({
       type: "POST",
       url: pathToAjaxDispatcher,
       data: postData,
       dataType: "json",
       success: function(data){
           isAjaxLoaded=false;
               if(data["success"]==1){
                   if(postData["context"]=="wrapCustomPage"){
                       setTimeout(function(){
                            $$("#superTransitionEffect").addClass("zeroopacity");
                                    mainView.router.load({
                                     template: Template7.templates.customPageTemplate,
                                     animatePages: false,
                                     reload: false,
                                     context: data
                                 });
                         window.setTimeout(function(){
                            $$("#superTransitionEffect").removeClass("bigCircleForTransition");
                            $this.closest(".flip-container").removeClass("hover");
                            if(postData["id"]==46){
                                $$(document).detectWithScroll();
                            }else if(postData["id"]==44){
                                $$(document).detectWithScroll1();
                            }
                            window.setTimeout(function(){
                                $$("#superTransitionEffect").removeClass("zeroopacity");
                            }, 1500);
                         }, 1500);
                       }, 300);
                    }else if(postData["context"]=="wrapAddNewUserNote"){
                        $this.attr("data-title", "");
                        $this.attr("data-sentonce", 0);
                        $$("#wrapUserNotes > ul").prepend($$(data["content"]));
                    }else if(postData["context"]=="sendUserNoteToUserMail"){
                        displayInfo(data["message"], $$("body"));
                    }else if(postData["context"]=="voteOnQuestion"){
                        displayInfo(data["message"], $$("body"));
                        $$("#wrapAgendaQuestions div[data-target='questionlist']").html(data["content"]);
                    }else if(postData["context"]=="wrapPollStatisticByOptions"){
                        $this.removeClass("spinner");
                        $$("#wrapPieChart").attr("data-countoptions", data["countoptions"]);
                        $$("#wrapPieChart #myChart").html("");
                   $$("#wrapPieChart").find("div.pieChartTextIntro").find("div.text-primary").html("n="+data["countusersvoted"]);
                   $$("[data-target='polloptions']").attr("data-countoptions", data["countoptions"]).html(data["content"]);
                   drawPieChart(data["results"], $$("#wrapPieChart #myChart")[0].getContext("2d"));
                   window.setTimeout(function(){
                        $$("[data-target='polloptions']").addClass("activated");
                   }, 200);
                        window.setTimeout(function(){
                                $$("#topHeader div.refreshPoll").removeClass("fadeInRight").addClass("fadeOutRight");
                        }, 10000);
                    }else{
                        mainView.router.load({
                            template: Template7.templates.loginTemplate,
                            animatePages: true,
                            reload: false
                        });
                    }
               }else{
                   displayAlert(data["message"], $$("body"));
               }
            return false;
       }, error: function(){
           isAjaxLoaded=false;
       }
    });
});

// In page callbacks:
myApp.onPageInit('discussion', function (page) {
    autoLoadCurrentDiscussion(page.context.id);
    $$('.page-content').scrollTop($$('#bottomOfMessages').offset().top, 0);
    window.setTimeout(function(){
        autoLoadCurrentDiscussion(page.context.id);
    }, reloadDiscussionEvery);
    
  // "page" variable contains all required information about loaded and initialized page 
});

myApp.onPageAfterBack('index', function(page){
    console.log("we are back to index, again");
    alert("it should work");
});

myApp.onPageInit('agenda', function (page) {
    var photo=$$("div.wrapAgendaDetails [data-action='openphotoinpopup']").attr("data-src");
    var myPhotoBrowserPopup = myApp.photoBrowser({
    photos : [
        photo
    ],
    type: 'popup',
    navbarTemplate: photoNavbarTemplate
});
    
    
    $$(document).on("click", "[data-action='openphotoinpopup']", function(e){
        e.preventDefault();
        myPhotoBrowserPopup.open();
    });
    
    
  // "page" variable contains all required information about loaded and initialized page 
});

myApp.onPageInit('index', function (page) {
    if($$("div.page.page-on-center div.page-content > #wrapWelcomeBlocks").length>0){
          console.log("wrapWelcomeBlocks");
          
          
        if(akaLocalStorageWelcomeTemplate!==null){
            var data=JSON.parse(akaLocalStorageWelcomeTemplate);
        }else{
            var data=JSON.parse(localStorage.getItem('welcomeTemplate'));
        }
         
        var welcomeTemplate = $$('#welcomeTemplate').html();
        // compile it with Template7
        var compiledWelcomeTemplate = Template7.compile(welcomeTemplate);
         
        var html=compiledWelcomeTemplate(data);
         
        $$("div.page.page-on-center div.page-content").html(html);
         /*
            mainView.router.load({
                template: Template7.templates.welcomeTemplate,
                animatePages: false,
                reload: false,
                context: data
            });
        */
      }
      if($$("div.page.page-on-center div.page-content #wrapTopAgendaDates").length>0){
            $$(document).detectWithScroll1();
        }
});



myApp.onPageInit('note', function (page) {
    window.setTimeout(function(){
        if($$("#wrapUserNotes > div.bodytext").html()==""){
            $$("#topHeader [data-action='joindiscussion']").trigger("click");
        }
    }, 200);
    
  // "page" variable contains all required information about loaded and initialized page 
});

myApp.onPageBack('*', function(page){
    autoLoadWelcomeTemplate();
});

myApp.onPageInit('question', function (page) {
    console.log('question page initialized agendaid=' + page.context.id);
    autoLoadCurrentAgendaQuestions(page.context.id);
});

myApp.onPageInit('poll', function (page) {
    console.log('poll page initialized');
   if($$("div.page-poll").length>0){
        autoLoadCurrentPoll(page.context.id);
   }
   
    window.setTimeout(function(){
            $$("#topHeader div.refreshPoll").removeClass("fadeOutRight").addClass("fadeInRight");
    }, 5000);
    
  // "page" variable contains all required information about loaded and initialized page 
});

$$(document).on("click", "input[type=file]", function(){
    $$(this).val("");
});

$$(document).on("change", "input[type=file]", function(){
    previewFile();
});

$$('input, textarea').on('focus', function(e) {
    e.preventDefault(); e.stopPropagation();
    window.scrollTo(0,0); //the second 0 marks the Y scroll pos. Setting this to i.e. 100 will push the screen up by 100px. 
});

function previewFile() {
  var preview = $$('#preview');
  var preview1 = $$('#preview1');
  var file    = $$('input[type=file]')[0].files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function (e) {
      console.log(e);
    
    if(isAjaxLoaded) return false;
    isAjaxLoaded=true;
    var postData={image: reader.result};
    $$("#container").addClass("activated");
    
    
    var animatePercentage=0;
    var startColor = '#faae30';
    var endColor = '#faae30';
    
    var circle = new ProgressBar.Circle(container, {
        color: startColor,
        trailColor: '#fff',
        trailWidth: 0,
        duration: 0,
        easing: 'linear',
        strokeWidth: 4,
        fill: 'rgba(255,255,255, 0.9)',
        text: {
            value: (animatePercentage * 100) + "%",
            className: 'progressbar__label'
        },
        // Set default step function for all animate calls
        step: function (state, circle) {
            circle.path.setAttribute('stroke', state.color);
        }
    });
    circle.text.style.fontSize = '1.5rem';
    
    
    $$.ajax({
        beforeSend: function(XMLHttpRequest)
  {
    //Upload progress
    XMLHttpRequest.upload.addEventListener("progress", function(evt){
      if (evt.lengthComputable) {  
        var percentComplete = evt.loaded / evt.total;
        
        AnimateCircle(circle, percentComplete);
      }
    }, false); 
    //Download progress
    XMLHttpRequest.addEventListener("progress", function(evt){
      if (evt.lengthComputable) {  
        var percentComplete = evt.loaded / evt.total;
        //Do something with download progress
      }
    }, false); 
  },
       type: "POST",
       url: pathToAjaxDispatcher + "?context=uploadPhoto&pathToUpload=images&infunction=appprofilephoto&filename=" + file.name,
       
       data: postData,
       dataType: "json",
       success: function(data){
           isAjaxLoaded=false;
               if(data["success"]==1){
                   preview.addClass("circle").children("img").attr("src", data["src"]);
                   preview1.html("").append($$("<div class='btn btn-upload'><input name='new-image' id='new-image' type='file' accept='image/*'></div><img src='"+data["src"]+"' alt='Upload Photo' />"));
                   $$("#container").removeClass("processing activated");
                   window.setTimeout(function(){
                       circle.destroy();
                   }, 500);
                   displayInfo(data["message"], $$("body"));
               }else{
                   displayAlert(data["message"], $$("body"));
               }
            return false;
       }, error: function(){
           isAjaxLoaded=false;
       }
    });
    
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

function drawPollStatisticByOptions(data){
    var percents=data;
    $$("#frmUserExperiencePoll div.wrapQuestion div[data-target='pollitem']").each(function(){
        var key=$$(this).attr("data-id");
        var percent=percents[key];
        $$("div.wrapPercents", this).html("<div class='bg-percent"+key+"'><div class='top50 abs'>"+percent+"%</div></div>");
    });
}

function drawPieChart(data, obj){
    if(data!=""){
        if(typeof(myPieChart)!="undefined"){
            myPieChart.update();
        }else{
            var myPieChart = new Chart(obj,{
                type: 'pie',
                data: data,
                options: {
            animation:{
                animateScale:true
            },
            legend: {
                display: false
             },
             tooltips: {
                enabled: false
             }
        }
            });
        }
    }
}

function checkIsUserStillLoggedIn(token){
    if(isAjaxLoaded) return false;
    isAjaxLoaded=true;
    var postData={context: "checkIsUserStillLoggedIn", token: token};
    
    $$.ajax({
       type: "POST",
       url: pathToAjaxDispatcher,
       data: postData,
       dataType: "json",
       success: function(data){
           isAjaxLoaded=false;
               if(data["success"]==1){
                   localStorage.setItem('welcomeTemplate', JSON.stringify(data));
                   var currentPage=mainView.activePage.name;
                   if(currentPage=="index"){
                        if(localStorage.getItem('welcomeTemplate')!==null){
                            var data=JSON.parse(localStorage.getItem('welcomeTemplate'));
                            mainView.router.load({
                                template: Template7.templates.welcomeTemplate,
                                animatePages: false,
                                reload: false,
                                context: data
                            });
                        }else{
                            mainView.router.load({
                                template: Template7.templates.loginTemplate,
                                animatePages: false,
                                reload: false
                            });
                        }
                        $$("#splashScreen").addClass("passive");
                            window.setTimeout(function(){
                                $$("#splashScreen").remove();
                            }, 1000);
                        
                   }
                   return true;
               }else{
                   return false;
               }
       }, error: function(){
           isAjaxLoaded=false;
           return false;
       }
    });
}

function autoLoadWelcomeTemplate(){
    //if(isAjaxLoadedLoop) return false;
    isAjaxLoadedLoop=true;
    var postData={context: "loadWelcomeTemplate"};
    
    $$.ajax({
       type: "POST",
       url: pathToAjaxDispatcher,
       data: postData,
       dataType: "json",
       success: function(data){
           isAjaxLoadedLoop=false;
               if(data["success"]==1){
                   var currentPageName=mainView.activePage.name;
                   
                   console.log("It is updating welcomeTemplate localStorage now.");
                   localStorage.setItem('welcomeTemplate', JSON.stringify(data));
                   akaLocalStorageWelcomeTemplate=JSON.stringify(data);
            if(currentPageName=='index'){       
                if($$("div.page.page-on-center div.page-content > #wrapWelcomeBlocks").length>0){
                    console.log("wrapWelcomeBlocks");

                    if(akaLocalStorageWelcomeTemplate!==null){
                      var data=JSON.parse(akaLocalStorageWelcomeTemplate);
                    }else{
                        var data=JSON.parse(localStorage.getItem('welcomeTemplate'));
                    }
                      mainView.router.load({
                          template: Template7.templates.welcomeTemplate,
                          animatePages: false,
                          reload: true,
                          context: data
                      });
                    }
                 }
               }
       }, error: function(){
           isAjaxLoadedLoop=false;
       }
    });
}

function autoLoadCurrentAgendaQuestions(id){
    if(isAjaxLoaded) return false;
    isAjaxLoaded=true;
    var postData={id: id, context: "loadCurrentAgendaQuestions"};
    
    $$.ajax({
       type: "POST",
       url: pathToAjaxDispatcher,
       data: postData,
       dataType: "json",
       success: function(data){
           isAjaxLoaded=false;
               if(data["success"]==1){
                   $$("#wrapAgendaQuestions div[data-target='questionlist']").html(data["content"]);
               }else{
                   
               }
           }, error: function(){
           isAjaxLoaded=false;
       }
   });
}

function autoLoadCurrentPoll(id){
    if(isAjaxLoaded) return false;
    isAjaxLoaded=true;
    var postData={id: id, context: "loadCurrentPollResults"};
    
    $$.ajax({
       type: "POST",
       url: pathToAjaxDispatcher,
       data: postData,
       dataType: "json",
       success: function(data){
           isAjaxLoaded=false;
               if(data["success"]==1){
                   if(data["answered"]>0){
                       $$("#wrapPieChart").attr("data-countoptions", data["countoptions"]);
                        $$("#wrapPieChart #myChart").html("");

                        $$("#wrapPieChart").find("div.pieChartTextIntro").find("div.text-primary").html("n="+data["countusersvoted"]);
                        
                        drawPieChart(data["results"], $$("#wrapPieChart #myChart")[0].getContext("2d"));
                        
                    }
                    $$("[data-target='polloptions']").attr("data-countoptions", data["countoptions"]).html(data["content"]);
                    window.setTimeout(function(){
                        $$("[data-target='polloptions']").addClass("activated");
                    }, 200);
               }
       }, error: function(){
           isAjaxLoaded=false;
       }
    });
}

function autoLoadCurrentDiscussion(id){
    if(isAjaxLoaded) return false;
    isAjaxLoaded=true;
    var postData={id: id, context: "loadCurrentDiscussion"};
    
    $$.ajax({
       type: "POST",
       url: pathToAjaxDispatcher,
       data: postData,
       dataType: "json",
       success: function(data){
           isAjaxLoaded=false;
               if(data["success"]==1){
                   $$("#wrapDiscussionPosts[data-id='"+id+"'] > div.bodytext").html("").append($$(data["content"]));
                   
                   window.setTimeout(function(){
                       $$.each(data["counts"], function (index, value) {
                           var targetItem=$$("#wrapDiscussions a[data-target='topiclist'][data-id='"+index+"']");
                        var newCounter=parseInt(value);
                        targetItem.attr("data-counter", newCounter).find("span[data-target='topiclist']").text(newCounter);
                        
                        });
                       //$$('.page-content').scrollTop($$('#bottomOfMessages').offset().top, 0);
                    }, 200);
                   
                   
               }
               window.setTimeout(function(){
                    autoLoadCurrentDiscussion(id);
                }, reloadDiscussionEvery);
            return false;
       }, error: function(){
           isAjaxLoaded=false;
       }
    });
}


function wrapProgressBar1(){
    // progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

var bar = new ProgressBar.Circle(container, {
  color: '#fff',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  text: {
    autoStyleContainer: false
  },
  from: { color: '#faae30', width: 4 },
  to: { color: '#faae30', width: 4 },
  // Set default step function for all animate calls
  
});

}

function AnimateCircle(circle, animatePercentage) {
    var startColor = '#faae30';
    var endColor = '#faae30';
    circle.animate(animatePercentage, {
        from: {
            color: startColor
        },
        to: {
            color: endColor
        }
    });
    var value = Math.round(animatePercentage * 100);
    if (value === 0) {
      circle.setText('');
    } else {
        if(value>=100){
           window.setTimeout(function(){
               $$("#container").addClass("processing"); 
           circle.text.style.fontSize = '1rem'; 
           circle.setText("Photo resizing."); 
           }, 500);
        }else{
            circle.setText(value+"%");
        }
    }
}

window.setInterval(function(){
    autoLoadWelcomeTemplate();
}, autoloadWelcomeTemplateEvery);

/*
myApp.onPageInit('page-name',function(page){
  var pageContainer=$$(page.container);
  pageContainer.on('click','input[type=file]',function(e){
      alert("here we go");
    var target=$$(this);
    var buttons=[{text:'<div data-my-source="CAMERA">take photo</div>'},
                 {text:'<div data-my-source="PHOTOLIBRARY">library</div>'},
                 {text:'<div data-my-source="SAVEDPHOTOALBUM">albums</div>'}];
    var actions=myApp.actions(target,buttons);
    $$(actions).once('click',function(e){
      var source=$$(this).attr('data-my-source');
      alert(source);
      uploadImage(page,source);
      myApp.closeModal(actions);
    });
  });
});

function uploadImage(page,source){
  var pageContainer=$$(page.container);
  ! function capturePhoto(){
      var pictureSource = navigator.camera.PictureSourceType[source]; 
      var destinationType = navigator.camera.DestinationType.FILE_URI;
      navigator.camera.getPicture(onSuccess,onFail,{
        destinationType:destinationType,
        sourceType:pictureSource,
        correctOrientation:true,
        allowEdit:false
      });
  }();
  function clearCameraCache(){navigator.camera.cleanup();}
  function onFail(message){ alert(message); return;}   
  function onSuccess(dataurl) {
      alert("Succeess " + dataurl);
        var tmpl = '<img src="' + dataurl + '" width="100%" height="100%"/>';
        pageContainer.find('.page-content').append(tmpl);
        window.resolveLocalFileSystemURL(dataurl, function (fileEntry) {
            fileEntry.file(function (fileObject) {
                var reader = new FileReader();
                reader.onloadend = function(evt){
                    var base = evt.target.result.split(',')[1];
                    $$.ajax({
                        type: "post", 
                        url: pathToAjaxDispatcher,
                        data: {base: base},
                        success: function (data) {
                        },
                        error: function (data) {
                        }
                    });
                    reader.readAsDataURL(fileObject);
                };
            },
                    function () {
                        return;
                    });
        });
    }
}
*/