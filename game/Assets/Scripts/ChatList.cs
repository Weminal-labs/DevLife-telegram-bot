using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using TMPro;
using UnityEngine;

public class ChatList : MonoBehaviour
{
    List<string> events = new List<string>();
    List<string> notis = new List<string>();
    List<MessageModel> messages = new List<MessageModel>() { };

    //Message List thì gọi api để lấy


    public GameObject containerContent;


    [Header("UI References")]
    public Transform eventListParent;
    public GameObject eventListingPrefab;
    public GameObject notiListingPrefab;
    public GameObject messageListingPrefab;
    public GameObject messageContent;

    private List<string> cacheNotis = new List<string>();
    private List<string> cacheEvents = new List<string>();
    private List<MessageModel> cacheMessages = new List<MessageModel>();



    public static ChatList Instance;

    private void Awake()
    {
        Instance = this;
    }

    public void Show(MessageModel messageModel)
    {
        GameObject contentBody = Instantiate(messageContent, containerContent.transform);
        contentBody.transform.GetChild(0).GetChild(0).GetComponent<TextMeshProUGUI>().SetText(messageModel.messageHeader);
        contentBody.transform.GetChild(1).GetChild(0).GetComponent<TextMeshProUGUI>().SetText(messageModel.messageBody);
    }

    private void Start()
    {
        string json = @"
        [
            { ""id"": 1, ""messageHeader"": ""Header 1"", ""messageBody"": ""Body 1"" },
            { ""id"": 2, ""messageHeader"": ""Header 2"", ""messageBody"": ""Body 2"" },
            { ""id"": 3, ""messageHeader"": ""Header 3"", ""messageBody"": ""Body 3"" }

        ]";
        receiveJsonMessage(json);
        CheckTime();
        UpdateUI();
        containerContent = gameObject.transform.parent.gameObject;
    }


    public void receiveJsonMessage(string json)
    {
        List<MessageModel> messagesList = JsonConvert.DeserializeObject<List<MessageModel>>(json);

        foreach (var message in messagesList)
        {
            messages.Add(message);
        }
    }

    private void CheckTime()
    {
        if (WorldTimeAPI.Instance.IsTimeLodaed)
        {
            DateTime current = WorldTimeAPI.Instance.GetCurrentDateTime();


            if (current.Hour >= 2)
            {
                events.Add("Time to coding");
            }
            if (current.Hour >= 3)
            {
                events.Add("3H: Time to coding");
                notis.Add("Next Event at 8:00");
            }


            if (current.Hour >= 8)
            {
                events.Add("8H: Breakfast time");
                notis.Add("Next Event at 9:00");

            }
            if (current.Hour >= 9)
            {
                events.Add("9H: Time to coding");
                notis.Add("Next Event at 11:00");

            }
            if (current.Hour >= 11)
            {
                events.Add("12H: Lunch time");
                notis.Add("Next Event at 12:00");

            }
            if (current.Hour >= 12)
            {
                events.Add("13H: Break time");
                notis.Add("Next Event at 14:00");

            }
            if (current.Hour >= 14)
            {
                events.Add("14H: Mentoring");

            }
            if (current.Hour >= 16)
            {
                events.Add("16H: Mentoring");
                notis.Add("Next Event at 18:00");


            }
            if (current.Hour >= 18)
            {
                events.Add("18H: Crazy Coding");
                notis.Add("Next Event at 19:00");

            }
            if (current.Hour >= 19)
            {
                events.Add("19H: Dinner time");
                notis.Add("Next Event at 22:00");

            }
            if (current.Hour >= 22)
            {
                events.Add("22H: Time to sleep");
            }
            if (current.Hour == 24)
            {
                events.Clear();
            }


        }
    }


    void UpdateUI()
    {
        foreach (Transform transform in eventListParent)
        {
            Destroy(transform.gameObject);
        }

        for (int j = 0; j < events.Count; j++)
        {
            GameObject roomItem = Instantiate(eventListingPrefab, eventListParent);
            roomItem.transform.GetChild(0).GetComponent<TextMeshProUGUI>().SetText("News: " + events[j]);


        }
        eventListParent.GetComponent<RectTransform>().sizeDelta = new Vector2(0, events.Count() * 250);

        if (messages.Count != 0)
        {
            for (int j = 0; j < messages.Count; j++)
            {
                GameObject message = Instantiate(messageListingPrefab, eventListParent);

                message.transform.GetChild(0).GetComponent<TextMeshProUGUI>().SetText("News: " + messages[j].messageHeader);
                message.GetComponent<EventListItem>().messageModel = messages[j];
            }
        }


        if (notis.Count != 0)
        {
            GameObject noti = Instantiate(notiListingPrefab, eventListParent);

            noti.transform.GetChild(0).GetComponent<TextMeshProUGUI>().SetText(notis.Last());
        }

    }


}

