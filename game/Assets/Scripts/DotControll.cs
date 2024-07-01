using System.Collections;
using UnityEngine;

public class DotControll : MonoBehaviour
{
    public GameObject playerControll;
    public void EnableDot()
    {
        print("EnableDot");
        gameObject.SetActive(true);
    }

    public void DisableDot()
    {
        print("DisableDot");
        gameObject.SetActive(false);
    }
}
