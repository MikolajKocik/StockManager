namespace UsernameTextBox
{
    public partial class UsernameTextBox : TextBox
    {
        public UsernameTextBox()
        {
            InitializeComponent();
        }

        protected override void OnKeyPress(KeyPressEventArgs e)
        {
            if ((e.KeyChar >= 'a' && e.KeyChar <= 'z') ||
                (e.KeyChar >= 'A' && e.KeyChar <= 'Z') ||
                (e.KeyChar >= '0' && e.KeyChar <= '9') ||
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
