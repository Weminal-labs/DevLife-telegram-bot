using UnityEngine;

public class EventListItem : MonoBehaviour
{

    public MessageModel messageModel;

    public void OnClick()
    {
        ChatList.Instance.Show(messageModel);
    }
}
