using TMPro;
using UnityEngine;

public class PageControll : MonoBehaviour
{
    public GameObject line;
    public GameObject dotFix, dotCommit, dotBug;
    public PlayerControll playerControl;
    public float time;
    public float timeAct;
    public bool isBug;
    public bool isHealing;
    public TextMeshProUGUI textClock;
    // Start is called before the first frame update
    void Start()
    {
        isBug = false;
        isHealing = false;
        for (int i = 0; i < 12; i++)
        {
            Instantiate(line, transform);
        }
        time = 15f;
        textClock.SetText("00:00");
    }

    // Update is called once per frame
    void Update()
    {
        if (timeAct > 0)
        {
            if (time <= 0)
            {
                if (!isHealing)
                {
                    if (isBug)
                    {
                        //Fixbug thành công
                        dotFix.GetComponent<DotControll>().EnableDot();
                        playerControl.setBugs(-1);
                        time = 30f;
                    }
                    else
                    {
                        // Commit thành công
                        int bugs = 0;
                        if (Random.Range(0, 5) == 0)
                        {
                            bugs = Random.Range(2, 4);
                            dotBug.GetComponent<DotControll>().EnableDot();
                        }

                        dotCommit.GetComponent<DotControll>().EnableDot();

                        playerControl.setCommits(1, bugs);
                        time = 15f;
                    }
                    Destroy(transform.GetChild(0).gameObject);
                    Instantiate(line, transform);
                }
                else
                {
                    playerControl.healing();
                    time = 30f;
                }
            }
            else
            {
                time -= Time.deltaTime;
            }
            timeAct -= Time.deltaTime;
            // Divide the time by 60
            float minutes = Mathf.FloorToInt(timeAct / 60);

            // Returns the remainder
            float seconds = Mathf.FloorToInt(timeAct % 60);
            string timeCount = string.Format("{0:00}:{1:00}", minutes, seconds);
            textClock.SetText(timeCount);
        }
        else
        {
            isBug = false;
            isHealing = false;
        }
    }
    public void setCancel()
    {
        isHealing = false;
        isBug = false;
        time = 0;
        timeAct = 0;
    }
}
