namespace UsernameTextBox
{
    public partial class LoginTextBox : TextBox
    {
        public LoginTextBox()
        {
            InitializeComponent();
        }

        protected override void OnKeyPress(KeyPressEventArgs e)
        {
            base.OnKeyPress(e);

            if ((e.KeyChar >= 'a' && e.KeyChar <= 'z') ||
                (e.KeyChar >= 'A' && e.KeyChar <= 'Z') ||
                (e.KeyChar >= '0' && e.KeyChar <= '9'))          
            {
                e.Handled = false;
            }
            else if ((e.KeyChar == (char)Keys.Enter) ||
                (e.KeyChar == (char)Keys.Back))
            {
                e.Handled = false;
            }
            else
            {
                e.Handled = true;
            }
        }
    }
}
