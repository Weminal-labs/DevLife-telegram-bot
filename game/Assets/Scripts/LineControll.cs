using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LineControll : MonoBehaviour
{
    public GameObject space;
    public GameObject word;
    public int[] spaceSize;
    public List<Color> colors;
    public Color normal;
    // Start is called before the first frame update
    void Start()
    {
        int width;
        int curSpace = 0;
        var space1 = Instantiate(space,transform);
        int index = Random.Range(0,3);
        curSpace += spaceSize[index];
        space1.GetComponent<RectTransform>().sizeDelta = new Vector2(spaceSize[index], 60);
        while (curSpace<1600)
        {
            width = Random.Range(120 ,750);
            var wordPointer = Instantiate(word,transform);
            wordPointer.GetComponent<RectTransform>().sizeDelta = new Vector2(width,60);
            if (Random.Range(0, 6) == 0)
            {
                wordPointer.GetComponent<Image>().color = colors[Random.Range(0,4)];
            }
            else
            {
                wordPointer.GetComponent<Image>().color = normal;
            }
            curSpace += width;
        }
        space1 = Instantiate(space,transform);
        space1.GetComponent<RectTransform>().sizeDelta = new Vector2(400, 60);
    }
}
