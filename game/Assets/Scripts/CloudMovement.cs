using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CloudMovement : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        Vector2 pos = transform.position;
        pos.x += 0.001f;
        transform.position = pos;
        if(transform.position.x > 5)
        {
            Destroy(this.gameObject);
        }
    }
}
