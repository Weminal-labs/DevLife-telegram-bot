using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PopUpPhone : MonoBehaviour
{
    public GameObject phone;
    public bool onPhone;
    // Start is called before the first frame update
    void Start()
    {
        onPhone = false;
    }

    // Update is called once per frame
    void Update()
    {
        
    }
    public void setPhone()
    {
        onPhone = !onPhone;
        phone.SetActive(onPhone);
    }
}
