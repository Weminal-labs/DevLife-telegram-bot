using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;    
using UnityEngine;
using UnityEngine.UI;

public class PhoneControll : MonoBehaviour
{
    public TextMeshProUGUI time;

    public GameObject containerContent;
    [Header("----------Button----------")]
    public Button music;
    public Button mail;
    public Button back;
    public Button home;
    public Button navigate;
    [Header("--------GameObject--------")]
    public GameObject musicContent;
    public GameObject mailContent;
    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        if (WorldTimeAPI.Instance.IsTimeLodaed)
        {
            DateTime current = WorldTimeAPI.Instance.GetCurrentDateTime();
            time.SetText(current.ToString("HH:mm"));
        }
    }
    public void openMusic()
    {
        Instantiate(musicContent, containerContent.transform);
    }
    public void openMail()
    {
        Instantiate(mailContent, containerContent.transform);
    }
    public void backButton()
    {
        if (containerContent.transform.childCount > 1)
        {
            Destroy(containerContent.transform.GetChild(containerContent.transform.childCount-1).gameObject);
        }
    }
    public void homeButton()
    {
        for(int i = containerContent.transform.childCount-1; i>0; i--)
        {
            Destroy(containerContent.transform.GetChild(i).gameObject);
        }
    }
}
