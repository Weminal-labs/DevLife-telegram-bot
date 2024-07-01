using Newtonsoft.Json;
using System;
using System.Runtime.InteropServices;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class PlayerControll : MonoBehaviour
{
    public GameObject[] player;
    public GameObject[] lockButton;
    public TextMeshProUGUI[] nameP;
    public GameObject buttons;
    public Slider[] slideStamina;
    public GameObject[] block;
    public TextMeshProUGUI[] textStamina;
    public PageControll pageControl;
    public int index;
    private int bugs;
    private int commits;
    private int tokens;
    private string id_cur_player;
    public TextMeshProUGUI textNameTeam;
    public TextMeshProUGUI textNumTeam;
    public TextMeshProUGUI textToken;
    public TextMeshProUGUI textCommits;
    public TextMeshProUGUI textBugs;
    public GameObject pause;
    public GameObject buttonCancel;
    public TextMeshProUGUI titlePause;
    public int stamina;
    private bool inLunch;
    // Start is called before the first frame update
    void Start()
    {
        string json = "{\r\n      team: {\r\n        name: \"Weminal\",\r\n        quantity: 4,\r\n        total_token: 0,\r\n        total_commit: 0,\r\n        total_bug: 0,\r\n      },\r\n      users: [\r\n        {\r\n          id: 1,\r\n          name: \"Hien\",\r\n          stamina: 100,\r\n          is_online: true,\r\n        },\r\n        {\r\n          id: 2,\r\n          name: \"Phuc\",\r\n          stamina: 100,\r\n          is_online: true,\r\n        },\r\n        {\r\n          id: 3,\r\n          name: \"Phap\",\r\n          stamina: 100,\r\n          is_online: true,\r\n        },\r\n        {\r\n          id: 4,\r\n          name: \"Tung\",\r\n          stamina: 100,\r\n          is_online: true,\r\n        },\r\n      ],\r\n      id_user_playing: 1,\r\n    }";
        receiveJsonTeam(json);
        inLunch = false;
    }
    private void Awake()
    {
#if UNITY_WEBGL == true && UNITY_EDITOR == false
        WebGLInput.captureAllKeyboardInput = false;
#endif
    }
    // Update is called once per frame
    void Update()
    {
        if (WorldTimeAPI.Instance.IsTimeLodaed)
        {
            DateTime current = WorldTimeAPI.Instance.GetCurrentDateTime();
            int time = Int32.Parse(current.ToString("HH"));
            if (time == 12 || time == 19)
            {
                lockButton[2].SetActive(false);
            }
            else
            {
                lockButton[2].SetActive(true);
            }
            if (time > 12 && inLunch)
            {
                stamina = 100;
                updateForDevTeam(0, 0, 100);
                textStamina[index].SetText(stamina.ToString());
                inLunch = false;
                pageControl.timeAct = 0f;
            }
        }
        if (stamina < 30)
        {
            lockButton[0].SetActive(true);
        }
        else
        {
            lockButton[0].SetActive(false);
        }
        if (stamina < 60)
        {
            lockButton[1].SetActive(true);
        }
        else
        {
            lockButton[1].SetActive(false);
        }
        slideStamina[index].value = stamina;
        if (pageControl.timeAct <= 0 && !inLunch)
        {
            buttons.SetActive(true);
            pause.SetActive(false);
            buttonCancel.SetActive(false);
        }
    }
    public void setPlayerExist(string jsonMem)
    {
        DataFromJsonMem data = JsonConvert.DeserializeObject<DataFromJsonMem>(jsonMem);
        id_cur_player = data.id_user_playing;
        foreach (var user in data.users)
        {
            player[data.users.IndexOf(user)].SetActive(true);
            slideStamina[data.users.IndexOf(user)].gameObject.SetActive(true);
            if (data.users[data.users.IndexOf(user)].id.Equals(id_cur_player))
            {
                index = data.users.IndexOf(user);
                stamina = data.users[data.users.IndexOf(user)].stamina;
            }
            slideStamina[data.users.IndexOf(user)].maxValue = 100f;
            slideStamina[data.users.IndexOf(user)].value = user.stamina;
            if (!user.is_online)
            {
                block[data.users.IndexOf(user)].GetComponent<Image>().color = new Color32(120, 120, 120, 60);
                block[data.users.IndexOf(user)].transform.GetChild(0).gameObject.SetActive(true);
            }
            else
            {
                block[data.users.IndexOf(user)].GetComponent<Image>().color = new Color32(120, 120, 120, 0);
                block[data.users.IndexOf(user)].transform.GetChild(0).gameObject.SetActive(false);
            }
            textStamina[data.users.IndexOf(user)].SetText(stamina.ToString());
            nameP[data.users.IndexOf(user)].gameObject.SetActive(true);
            nameP[data.users.IndexOf(user)].SetText(user.name);
        }
    }
    public void codeSet()
    {
        stamina -= 30;
        pageControl.timeAct = 60f * 45;
        pageControl.time = 15f;
        pageControl.isBug = false;
        buttons.SetActive(false);
        buttonCancel.SetActive(true);
        textStamina[index].SetText(stamina.ToString());
        updateForDevTeam(0, 0, -30);
    }
    public void fixBugSet()
    {
        stamina -= 60;
        pageControl.timeAct = 60f * 30;
        pageControl.time = 30f;
        pageControl.isBug = true;
        buttons.SetActive(false);
        buttonCancel.SetActive(true);
        textStamina[index].SetText(stamina.ToString());
        updateForDevTeam(0, 0, -60);
    }
    public void eatSet()
    {
        buttons.SetActive(false);
        pageControl.timeAct = 60f * 60;
        pageControl.time = 1f;
        pageControl.isHealing = true;
        pause.SetActive(true);
        buttonCancel.SetActive(true);
        inLunch = true;
        titlePause.SetText("You can go for lunch!");
    }
    public void breakSet()
    {
        pageControl.timeAct = 60f * 15;
        pageControl.time = 30f;
        pageControl.isHealing = true;
        buttons.SetActive(false);
        pause.SetActive(true);
        titlePause.SetText("Take a break!");
        buttonCancel.SetActive(true);
    }
    public void setBugs(int num)
    {
        if (bugs == 0)
        {
            pageControl.timeAct = 0;
        }
        else
        {
            updateForDevTeam(1, -1, 0);
        }
    }
    public void setCommits(int num, int numBugs)
    {
        updateForDevTeam(num, numBugs, 0);
    }
    public void receiveJsonTeam(string json)
    {
        DataFromJsonMem jsonObject = JsonConvert.DeserializeObject<DataFromJsonMem>(json);
        tokens = Int32.Parse(jsonObject.team.total_token.ToString());
        commits = Int32.Parse(jsonObject.team.total_commit.ToString());
        bugs = Int32.Parse(jsonObject.team.total_bug.ToString());
        setPlayerExist(json);
        textNumTeam.SetText("Teams\n" + jsonObject.team.quantity.ToString() + "/4");
        textNameTeam.SetText(jsonObject.team.name);
        textCommits.SetText("Commits: " + commits);
        textBugs.SetText("Bugs: " + bugs);
        textToken.SetText("Tokens: " + tokens);
    }
    public void healing()
    {
        stamina += 1;
        if (stamina > 100)
        {
            stamina = 100;
            pageControl.setCancel();
        }
        else
        {
            updateForDevTeam(0, 0, 1);
        }
        textStamina[index].SetText(stamina.ToString());
    }
    public void updateForDevTeam(int commits, int bugs, int stamina)
    {
        DataToJson data = new DataToJson { id_player = id_cur_player, commits = commits, bugs = bugs, stamina = stamina };
        string json = JsonConvert.SerializeObject(data);
        /*UpdateDataDev(json);*/
    }

    [DllImport("__Internal")]
    public static extern void UpdateDataDev(string json);
}
