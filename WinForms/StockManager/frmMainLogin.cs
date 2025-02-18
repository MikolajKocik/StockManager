using System.Windows.Forms;

namespace StockManager
{
    public partial class frmMainLogin : Form
    {
        public frmMainLogin()
        {
            InitializeComponent();
        }

        private async void btnLogin_ClickAsync(object sender, EventArgs e)
        {


        }

        private async void lnkRegister_LinkClickedAsync(object sender, LinkLabelLinkClickedEventArgs e)
        {

        }

        private void txtUsername_KeyPress(object sender, KeyPressEventArgs e)
        {
            RedirectToNextTexBox(sender, e);
        }

        private void txtPassword_KeyPress(object sender, KeyPressEventArgs e)
        {
            RedirectToNextTexBox(sender, e);
        }

        private void RedirectToNextTexBox(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == (char)Keys.Enter && sender is Control currentControl)
            {
                e.Handled = true;
                currentControl.Parent?.SelectNextControl(currentControl, true, true, true, true);
            }
        }
    }
}
