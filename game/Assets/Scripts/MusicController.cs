using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class MusicController : MonoBehaviour
{
    public TextMeshProUGUI title;
    public TextMeshProUGUI nameAudio;
    public GameObject buttonPause;
    public bool isPlay;
    public int index;
    public Sprite play;
    public Sprite pause;
    public AudioSource audioSource;
    public AudioClip[] audioClips;
    public Slider timeLine;
    private void Start()
    {
        isPlay = true;
        audioSource = GameObject.FindGameObjectWithTag("Audio").GetComponentInChildren<AudioSource>();
        index = 0;
        timeLine.maxValue = audioClips[index].length;
        timeLine.value = 0;
        nameAudio.SetText(audioClips[index].name.ToString() + " - In Love With a Ghost");
    }
    private void Update()
    {
        if (WorldTimeAPI.Instance.IsTimeLodaed)
        {
            DateTime current = WorldTimeAPI.Instance.GetCurrentDateTime();

            switch (current.ToString("HH"))
            {
                case "01":
                    title.SetText("Crazy Coding");
                    break;
                case "02":
                    title.SetText("Crazy Coding");
                    break;
                case "03":
                    title.SetText("Crazy Coding");
                    break;
                case "12":
                    title.SetText("Lunch Time");
                    break;
                case "13":
                    title.SetText("Break Time");
                    break;
                case "14":
                    title.SetText("Break Time");
                    break;
                case "15":
                    title.SetText("Mentoring");
                    break;
                case "16":
                    title.SetText("Mentoring");
                    break;
                case "17":
                    title.SetText("Coding");
                    break;
                case "18":
                    title.SetText("Coding");
                    break;
                case "19":
                    title.SetText("Dinner");
                    break;
                case "20":
                    title.SetText("Break Time");
                    break;
                case "21":
                    title.SetText("Crazy Coding");
                    break;
                case "22":
                    title.SetText("Crazy Coding");
                    break;
                case "23":
                    title.SetText("Crazy Coding");
                    break;
                case "24":
                    title.SetText("Crazy Coding");
                    break;
                default:
                    title.SetText("Speed Run");
                    break;
            }
        }
        if(timeLine.value >= timeLine.maxValue)
        {
            timeLine.value = 0;
            nextSound();
        }
        else
        {
            if (isPlay)
            {
                timeLine.value += Time.deltaTime;
            }
        }
    }
    public void setPausePlay()
    {
        isPlay = !isPlay;
        if (isPlay)
        {
            buttonPause.gameObject.GetComponent<Image>().sprite = pause;
            audioSource.Play();
        }
        else
        {
            buttonPause.gameObject.GetComponent<Image>().sprite = play;
            audioSource.Pause();
        }
    }
    public void nextSound()
    {
        index++;
        if(index >= audioClips.Length)
        {
            index = 0;
        }
        isPlay = false;
        setPausePlay();
        audioSource.clip = audioClips[index];
        audioSource.Play();
        nameAudio.SetText(audioClips[index].name.ToString()+ " - In Love With a Ghost");
        timeLine.maxValue = audioClips[index].length;
        timeLine.value = 0;
    }
    public void preSound()
    {
        index--;
        if (index <= 0)
        {
            index = audioClips.Length-1;
        }
        isPlay = false;
        setPausePlay();
        audioSource.clip = audioClips[index];
        audioSource.Play();
        nameAudio.SetText(audioClips[index].name.ToString() + " - In Love With a Ghost");
        timeLine.maxValue = audioClips[index].length;
        timeLine.value = 0;
    }
}
