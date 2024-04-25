import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/time;
import wso2/choreo.sendemail as ChoreoEmail;

configurable string tasksApiUrl = ?;

type Task record {
    string dueDate;
    string email;
    int id;
    string name;
    string title;
};

public function main() returns error? {
    io:println("Tasks API URL: " + tasksApiUrl);
    http:Client tasksApiEndpoint = check new (tasksApiUrl);

    // Fetching upcoming tasks
    Task[] tasks = check tasksApiEndpoint->/tasks(upcoming = "true");

    foreach Task task in tasks {
        // Sending a reminder email for each task
        check sendReminderEmail(task);
    }
}

function sendReminderEmail(Task task) returns error? {
    // Format the due date
    string formattedDueDate = check getFormattedDueDate(task.dueDate);

    string taskServiceName = convertAndCapitalize(task.'title);

    // Email content
    string emailContent = string `
Dear ${task.name},

This is a reminder that you have a task titled "${taskServiceName}" due on ${formattedDueDate}.

Thank you for using our task management system. We are here to support you at every stage of your productivity journey.

Best regards,
The TaskMaster Team

---

TaskMaster - Your Partner in Productivity

Website: https://www.taskmaster.com
Support: support@taskmaster.com
Phone: +1 (800) 123-5555

Follow us on:

Facebook: https://www.facebook.com/TaskMaster
Twitter: https://twitter.com/TaskMaster

Privacy Policy | Terms of Use | Unsubscribe

This message is intended only for the recipient and may contain confidential information. If you are not the intended recipient, please disregard this message.
`;

    // Sending the email
    ChoreoEmail:Client emailClient = check new ();
    string sendEmailResponse = check emailClient->sendEmail(task.email, "Upcoming Task Reminder", emailContent);
    log:printInfo("Email sent successfully to: " + task.email + " with response: " + sendEmailResponse);
}

function getFormattedDueDate(string utcDueDate) returns string|error {
    time:Utc utcTime = check time:utcFromString(utcDueDate);

    time:TimeZone zone = check new ("Asia/Colombo"); // Change to your preferred timezone
    time:Civil localTime = zone.utcToCivil(utcTime);

    string formattedDueDate = check time:civilToEmailString(localTime, time:PREFER_TIME_ABBREV);
    return formattedDueDate;
}

function convertAndCapitalize(string input) returns string {
    string:RegExp r = re `-`;
    // Split the input string by '-'
    string[] parts = r.split(input);

    // Capitalize the first letter of each part and join them with a space
    string result = "";
    foreach var word in parts {
        string capitalizedWord = word.substring(0, 1).toUpperAscii() + word.substring(1).toLowerAscii();
        if (result.length() > 0) {
            result = result + " " + capitalizedWord;
        } else {
            result = capitalizedWord;
        }
    }

    return result;
}
