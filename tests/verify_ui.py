
import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Log console messages
        page.on("console", lambda msg: print(f"CONSOLE: {msg.type}: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        # Load the mock WP page
        await page.goto(f'file://{os.getcwd()}/tests/mock-wp.html')

        # Wait for React to render
        await page.wait_for_selector('text=REST Route & Action Manager')

        # Take a screenshot of the list view
        await page.screenshot(path='tests/verification/list_view_v3.png')

        # Click the first "edit" button
        edit_buttons = page.get_by_text("edit")
        if await edit_buttons.count() > 0:
            await edit_buttons.first.click()
            print("Clicked edit button")
        else:
            print("No edit button found!")

        # Wait for builder view
        try:
            await page.wait_for_selector('.builder-grid', timeout=5000)
            print("Builder view loaded")

            # Take a screenshot of the builder view
            await page.screenshot(path='tests/verification/builder_view_v3.png')

            # Click on "is_user_logged_in" to change to custom
            # Using value instead of label to be safer
            await page.select_option('select', value='custom')
            print("Selected custom option")

            # Wait for custom input to appear (it should have placeholder "my_custom_permission_check")
            await page.wait_for_selector('input[placeholder="my_custom_permission_check"]', timeout=2000)
            print("Custom permission input appeared")

            # Type something in it
            await page.fill('input[placeholder="my_custom_permission_check"]', 'my_custom_check_func')

            # Take screenshot of the inspector with custom input
            await page.screenshot(path='tests/verification/inspector_custom_v3.png')
            print("Saved inspector_custom_v3.png")

        except Exception as e:
            print(f"Error during builder view verification: {e}")
            await page.screenshot(path='tests/verification/debug_after_click_v3.png')

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
