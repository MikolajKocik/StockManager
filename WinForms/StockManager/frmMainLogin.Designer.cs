namespace StockManager
{
    partial class frmMainLogin
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmMainLogin));
            picLogin = new PictureBox();
            btnLogin = new Button();
            lnkRegister = new LinkLabel();
            lblUsername = new Label();
            lblPassword = new Label();
            label1 = new Label();
            panel1 = new Panel();
            panel2 = new Panel();
            usernameTextBox1 = new UsernameTextBox.UsernameTextBox();
            usernameTextBox2 = new UsernameTextBox.UsernameTextBox();
            ((System.ComponentModel.ISupportInitialize)picLogin).BeginInit();
            panel2.SuspendLayout();
            SuspendLayout();
            // 
            // picLogin
            // 
            picLogin.Dock = DockStyle.Left;
            picLogin.Image = (Image)resources.GetObject("picLogin.Image");
            picLogin.Location = new Point(0, 0);
            picLogin.Name = "picLogin";
            picLogin.Size = new Size(358, 479);
            picLogin.SizeMode = PictureBoxSizeMode.Zoom;
            picLogin.TabIndex = 0;
            picLogin.TabStop = false;
            // 
            // btnLogin
            // 
            btnLogin.Location = new Point(541, 343);
            btnLogin.Name = "btnLogin";
            btnLogin.Size = new Size(112, 34);
            btnLogin.TabIndex = 1;
            btnLogin.Text = "Login";
            btnLogin.UseVisualStyleBackColor = true;
            btnLogin.Click += btnLogin_Click;
            // 
            // lnkRegister
            // 
            lnkRegister.ActiveLinkColor = Color.White;
            lnkRegister.AutoSize = true;
            lnkRegister.Location = new Point(50, 24);
            lnkRegister.Name = "lnkRegister";
            lnkRegister.Size = new Size(251, 50);
            lnkRegister.TabIndex = 3;
            lnkRegister.TabStop = true;
            lnkRegister.Text = "Are you a manager? Click here\r\n\r\n";
            lnkRegister.LinkClicked += lnkRegister_LinkClicked;
            // 
            // lblUsername
            // 
            lblUsername.AutoSize = true;
            lblUsername.Font = new Font("Segoe UI", 12F, FontStyle.Bold, GraphicsUnit.Point, 238);
            lblUsername.ForeColor = Color.Black;
            lblUsername.Location = new Point(533, 74);
            lblUsername.Name = "lblUsername";
            lblUsername.Size = new Size(128, 32);
            lblUsername.TabIndex = 4;
            lblUsername.Text = "Username";
            // 
            // lblPassword
            // 
            lblPassword.AutoSize = true;
            lblPassword.Font = new Font("Segoe UI", 12F, FontStyle.Bold, GraphicsUnit.Point, 238);
            lblPassword.Location = new Point(535, 209);
            lblPassword.Name = "lblPassword";
            lblPassword.Size = new Size(122, 32);
            lblPassword.TabIndex = 5;
            lblPassword.Text = "Password";
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Font = new Font("Segoe UI Semibold", 10F, FontStyle.Bold, GraphicsUnit.Point, 238);
            label1.ForeColor = Color.White;
            label1.Location = new Point(501, 413);
            label1.Name = "label1";
            label1.Size = new Size(0, 28);
            label1.TabIndex = 8;
            // 
            // panel1
            // 
            panel1.BackColor = Color.White;
            panel1.Location = new Point(0, 0);
            panel1.Name = "panel1";
            panel1.Size = new Size(358, 77);
            panel1.TabIndex = 9;
            // 
            // panel2
            // 
            panel2.BackColor = Color.White;
            panel2.Controls.Add(lnkRegister);
            panel2.Location = new Point(0, 402);
            panel2.Name = "panel2";
            panel2.Size = new Size(358, 77);
            panel2.TabIndex = 10;
            // 
            // usernameTextBox1
            // 
            usernameTextBox1.Location = new Point(476, 137);
            usernameTextBox1.Name = "usernameTextBox1";
            usernameTextBox1.Size = new Size(244, 31);
            usernameTextBox1.TabIndex = 11;
            // 
            // usernameTextBox2
            // 
            usernameTextBox2.Location = new Point(476, 276);
            usernameTextBox2.Name = "usernameTextBox2";
            usernameTextBox2.Size = new Size(244, 31);
            usernameTextBox2.TabIndex = 12;
            // 
            // frmMainLogin
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.Goldenrod;
            BackgroundImageLayout = ImageLayout.Center;
            ClientSize = new Size(833, 479);
            Controls.Add(usernameTextBox2);
            Controls.Add(usernameTextBox1);
            Controls.Add(panel2);
            Controls.Add(panel1);
            Controls.Add(label1);
            Controls.Add(lblPassword);
            Controls.Add(lblUsername);
            Controls.Add(btnLogin);
            Controls.Add(picLogin);
            Name = "frmMainLogin";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Stock Manager Authorization";
            ((System.ComponentModel.ISupportInitialize)picLogin).EndInit();
            panel2.ResumeLayout(false);
            panel2.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private PictureBox picLogin;
        private Button btnLogin;
        private LinkLabel lnkRegister;
        private Label lblUsername;
        private Label lblPassword;
        private Label label1;
        private Panel panel1;
        private Panel panel2;
        private UsernameTextBox.UsernameTextBox usernameTextBox1;
        private UsernameTextBox.UsernameTextBox usernameTextBox2;
    }
}
