using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class DayNightControll : MonoBehaviour
{
    public GameObject BackgroundNight;
    public GameObject LightNight;
    public GameObject LightDay;
    public GameObject LightBillBoard;
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
            int time = Int32.Parse(current.ToString("HH"));
            if (5 < time && time < 18)
            {
                BackgroundNight.SetActive(false);
                LightNight.SetActive(false);
                LightDay.SetActive(true);
                LightBillBoard.SetActive(false);
            }
            else
            {
                BackgroundNight.SetActive(true);
                LightNight.SetActive(true);
                LightDay.SetActive(false);
                LightBillBoard.SetActive(true);
            }
        }
    }
}
