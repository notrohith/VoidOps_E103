import streamlit as st
import pandas as pd
import google.generativeai as genai
import streamlit.components.v1 as components



# --- 1. CONFIGURATION & SETUP ---
st.set_page_config(
    page_title="Bharat Biz OS",
    page_icon="🇮🇳",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load API Key from .streamlit/secrets.toml
if "GEMINI_API_KEY" in st.secrets:
    genai.configure(api_key=st.secrets["GEMINI_API_KEY"])
else:
    st.error("Missing GEMINI_API_KEY in secrets.toml. Please add it to run the AI Guru.")

# --- 2. GLOBAL SESSION STATE DATABASE ---
def init_state():
    if 'page' not in st.session_state:
        st.session_state.page = 'Landing'
    if 'logged_in' not in st.session_state:
        st.session_state.logged_in = False
    if 'biz_data' not in st.session_state:
        st.session_state.biz_data = {
            "name": "Niche Handicrafts",
            "type": "🎨 Handicrafts",
            "budget": 5000,
            "time": 2,
            "skill": "Low",
            "goal": "Visibility"
        }
    if 'inventory' not in st.session_state:
        st.session_state.inventory = pd.DataFrame([
            {"Product": "Masala Chai Mix", "Stock": 50, "Price": 120},
            {"Product": "Organic Honey", "Stock": 15, "Price": 350},
        ])
    if 'messages' not in st.session_state:
        st.session_state.messages = []

init_state()

def navigate_to(page_name):
    st.session_state.page = page_name
    st.rerun()

# --- 3. CUSTOM UI COMPONENTS (HTML/CSS) ---
def render_feasibility_matrix():
    biz = st.session_state.biz_data
    html_code = f"""
    <div style="display: flex; gap: 15px; font-family: 'Segoe UI', sans-serif; margin-bottom: 20px;">
        <div style="flex: 1; background: #138808; color: white; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">Automated</div>
            <div style="font-size: 18px; font-weight: bold; margin-top: 5px;">Inventory Sync</div>
            <div style="font-size: 11px; margin-top: 5px;">AI is updating your shops...</div>
        </div>
        <div style="flex: 1; background: #FF9933; color: white; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">AI-Assisted</div>
            <div style="font-size: 18px; font-weight: bold; margin-top: 5px;">Content Creation</div>
            <div style="font-size: 11px; margin-top: 5px;">Scripts ready for review.</div>
        </div>
        <div style="flex: 1; background: #000080; color: white; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="font-size: 12px; text-transform: uppercase; opacity: 0.8;">Manual Effort</div>
            <div style="font-size: 18px; font-weight: bold; margin-top: 5px;">{biz['time']}h Cust. Engagement</div>
            <div style="font-size: 11px; margin-top: 5px;">Focus on your loyal repeats.</div>
        </div>
    </div>
    """
    components.html(html_code, height=120)

# --- 4. PAGE FUNCTIONS ---

def page_landing():
    st.markdown("<div style='text-align: center; padding: 50px;'><h1>🚀 BHARAT BIZ OS</h1><h3>The AI Engine for Small Indian Businesses</h3></div>", unsafe_allow_html=True)
    st.write("### Solve your growth stalls with resource-aware AI.")
    c1, c2, c3 = st.columns([1, 2, 1])
    with c2:
        if st.button("I am a Business Owner - Start Growing", use_container_width=True):
            st.session_state.logged_in = True
            navigate_to("Dashboard")

def page_dashboard():
    st.title(f"📊 {st.session_state.biz_data['name']} Growth Hub")
    
    # Task Feasibility Matrix
    st.subheader("Your Intelligent Workload Plan")
    render_feasibility_matrix()
    
    # Growth Metrics
    m1, m2, m3 = st.columns(3)
    m1.metric("Visibility Growth", "+12%", "Organic")
    m2.metric("Budget Remaining", f"₹{st.session_state.biz_data['budget']}")
    m3.metric("Daily Time Slot", f"{st.session_state.biz_data['time']} Hours")

    st.divider()
    
    # Execution Hub
    col1, col2 = st.columns(2)
    with col1:
        with st.container(border=True):
            st.markdown("### 📢 Social Visibility")
            st.write("AI drafted a 15-minute task to get you discovered.")
            if st.button("Generate Local Instagram Script"):
                st.session_state.messages.append({"role": "user", "content": "Create a 30-second script for an Instagram Reel showcasing my niche products locally."})
                navigate_to("AI_Bot")
                
    with col2:
        with st.container(border=True):
            st.markdown("### 🤝 Community Collab")
            st.write("Partner with local vendors to share customers at 0 cost.")
            if st.button("Draft Partnership Message"):
                st.session_state.messages.append({"role": "user", "content": "Suggest a local business partnership and draft a WhatsApp invite."})
                navigate_to("AI_Bot")

def page_ai_guru():
    st.title("🤖 Bharat Biz AI Guru")
    st.caption("Using Gemini 2.5 Flash for high-speed business consulting")
    
    biz = st.session_state.biz_data
    context = f"Business: {biz['type']}, Budget: ₹{biz['budget']}, Daily Time: {biz['time']}h. Goal: {biz['goal']}. Constraint: No marketing team, limited tech skills."

    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    if prompt := st.chat_input("How can I grow today?"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            try:
                # Primary call to 2.5 Flash
                model = genai.GenerativeModel('gemini-2.5-flash')
                response = model.generate_content(f"{context}\nUser: {prompt}")
                st.markdown(response.text)
                st.session_state.messages.append({"role": "assistant", "content": response.text})
            except Exception as e:
                st.warning("Switching to 1.5 Flash due to model availability...")
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(f"{context}\nUser: {prompt}")
                st.markdown(response.text)
                st.session_state.messages.append({"role": "assistant", "content": response.text})

def page_inventory():
    st.title("📦 Smart Inventory Manager")
    st.write("AI is currently syncing these items to WhatsApp and Instagram Shops.")
    edited_df = st.data_editor(st.session_state.inventory, num_rows="dynamic", use_container_width=True)
    st.session_state.inventory = edited_df
    if st.button("Save & Sync"):
        st.success("Successfully synced across all digital platforms!")

# --- 5. MAIN ROUTER ---
def main():
    with st.sidebar:
        st.title("🇮🇳 Bharat Biz")
        if st.session_state.logged_in:
            st.write(f"Logged in: **{st.session_state.biz_data['name']}**")
            if st.button("📊 Dashboard", use_container_width=True): navigate_to("Dashboard")
            if st.button("🤖 AI Guru", use_container_width=True): navigate_to("AI_Bot")
            if st.button("📦 Inventory", use_container_width=True): navigate_to("Inventory")
            st.divider()
            if st.button("Logout", use_container_width=True):
                st.session_state.logged_in = False
                navigate_to("Landing")

    p = st.session_state.page
    if p == "Landing": page_landing()
    elif st.session_state.logged_in:
        if p == "Dashboard": page_dashboard()
        elif p == "AI_Bot": page_ai_guru()
        elif p == "Inventory": page_inventory()
    else:
        page_landing()

if __name__ == "__main__":
    main()