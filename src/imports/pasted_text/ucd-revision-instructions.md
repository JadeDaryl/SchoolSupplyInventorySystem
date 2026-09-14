YOU ARE REVISING AN EXISTING APPLICATION, NOT CREATING A NEW ONE.

The project already contains a working React + TypeScript + Vite School Supply Inventory System.

FIRST, INSPECT THE EXISTING CODEBASE BEFORE MAKING ANY DESIGN CHANGES.

The repository already contains the current interface, reusable components, sample data, role handling, product data, suppliers, stock transactions, audit logs, backups, tables, cards, forms, alerts, modals, tabs, and other UI elements.

Do not throw away the existing implementation.

Do not replace the application with a completely different visual design.

Do not rewrite the entire app architecture just to make the UI look different.

The goal is:

EXISTING GUI
→ inspect
→ identify usability problems
→ preserve what already works
→ revise weak areas
→ align with UCD principles
→ align with the finalized DFD
→ improve speed, visibility, error prevention, feedback, consistency, and learnability

==================================================
0. IMPORTANT PRESENTATION / OUTPUT RULE
==================================================

REMOVE the laptop/device mockup or laptop illustration.

Show ONLY the GUI/application window.

Do not place the interface inside:
- a laptop
- desktop monitor
- tablet
- phone
- browser-device mockup
- 3D computer frame

The final output should appear as the actual application interface.

==================================================
1. SOURCE OF TRUTH
==================================================

Use THREE sources of truth:

SOURCE 1:
The existing source code.

SOURCE 2:
The finalized School Supply Inventory System Level 1 and Level 2 DFD.

SOURCE 3:
The provided HCI User-Centered Design presentation.

Do not invent functionality outside those three sources unless it is necessary to improve usability of an already-existing feature.

The DFD defines what the application does.

The existing code defines what the application currently looks like and how it currently behaves.

The UCD/HCI presentation defines how the interface should be improved.

The revision should reconcile all three.

==================================================
2. CURRENT SYSTEM SCOPE
==================================================

The application is an internal School Supply Inventory System.

Primary users:

STAFF
- performs day-to-day inventory operations
- records Stock-In
- records Stock-Out
- searches and views products
- maintains product information where permitted
- maintains supplier information where permitted
- views inventory
- performs authorized stock operations

INVENTORY MANAGER / ADMIN
- manages user accounts
- manages roles and permissions
- manages products
- manages suppliers
- performs or authorizes stock operations
- monitors inventory
- manages reorder levels
- generates reports
- reviews activity and audit logs
- performs backup and restore

CUSTOMER:
Not a direct system user.

SUPPLIER:
Not a direct system user.

Do not create customer login functionality.

Do not create supplier login functionality.

Do not create:
- shopping cart
- customer checkout
- online payment
- customer ordering portal
- supplier portal
- online procurement workflow

The system records and monitors inventory rather than acting as a full POS or e-commerce platform.

==================================================
3. EXISTING CODE MUST BE PRESERVED WHERE IT ALREADY WORKS
==================================================

Inspect and retain existing reusable components and design patterns wherever appropriate.

The current codebase already contains reusable components such as:
- Badge
- StatusBadge
- StockBadge
- Th
- Td
- Input
- Select
- Textarea
- Btn
- Card
- SectionHeader
- Alert
- Modal
- TabBar

Do not unnecessarily replace these components.

Instead:
- improve their styling
- improve their consistency
- improve their semantics
- improve their spacing
- improve their states
- improve their accessibility
- improve how they are used across screens

Create new reusable components only when the current implementation genuinely lacks something needed for the UCD revision.

Avoid duplicating UI patterns that could be handled through an improved shared component.

==================================================
4. UCD GOAL
==================================================

The interface should be revised according to the User-Centered Design process:

USER RESEARCH
→ identify user needs and problems

PERSONA
→ understand Staff and Inventory Manager goals

USER JOURNEY
→ understand the sequence of actions users perform

REQUIREMENTS
→ identify functional and non-functional needs

PROTOTYPE
→ refine the existing interface

USER TESTING / EVALUATION
→ identify usability problems

IMPROVEMENT
→ revise the interface based on evidence and observed problems

The provided HCI presentation emphasizes:
- understanding user needs
- understanding goals
- understanding behavior
- identifying frustrations
- gathering requirements
- creating personas
- mapping user journeys
- designing prototypes
- testing and improving the design

Use this philosophy throughout the revision.

==================================================
5. PRIMARY USER PROBLEM
==================================================

The interface is being used in a busy school supply environment.

Staff may:
- process many transactions
- work under time pressure
- repeatedly enter inventory movements
- search for products frequently
- handle physical products while using the interface
- need immediate confirmation that an action succeeded

Therefore the interface must prioritize:

1. SPEED
2. VISIBILITY
3. ERROR PREVENTION
4. CLEAR FEEDBACK
5. SIMPLE TASK FLOW
6. LOW COGNITIVE LOAD
7. EASY SCANNING
8. USER CONTROL

Do not optimize for visual novelty.

Optimize for task performance.

==================================================
6. MAIN REVISION PRINCIPLE
==================================================

For every existing screen, ask:

WHAT DOES THE USER NEED TO DO?

WHAT INFORMATION DOES THE USER NEED FIRST?

WHAT INFORMATION CAN BE SECONDARY?

WHAT CAN THE USER MISUNDERSTAND?

WHAT CAN THE USER ACCIDENTALLY DO?

WHAT INFORMATION SHOULD BE IMMEDIATELY VISIBLE?

WHAT SHOULD HAPPEN AFTER THE USER COMPLETES THE ACTION?

WHAT SHOULD HAPPEN IF THE ACTION FAILS?

Then modify the current UI accordingly.

==================================================
7. GLOBAL TYPOGRAPHY REVISION
==================================================

Preserve the existing font identity if it is already appropriate.

Use a readable sans-serif for:
- labels
- headings
- navigation
- instructions
- buttons
- descriptions

Use a monospaced font for:
- product codes
- barcodes
- user IDs
- stock quantities
- prices
- transaction IDs
- report numbers

Numerical data should align cleanly in tables.

Review text that is:
- too small
- too light
- overly condensed
- difficult to distinguish at a glance

Do not make every element large.

Preserve hierarchy.

==================================================
8. GLOBAL SPACING AND PROXIMITY
==================================================

Review every table, card, form, and action group.

Use sufficient padding.

Do not place unrelated controls directly beside each other.

Group related information.

For example:

PRODUCT INFORMATION
- Product Name
- Product Code
- Barcode
- Category
- Unit

should form one visual group.

STOCK TRANSACTION INFORMATION
- Current Stock
- Quantity
- Remaining Stock

should form another visual group.

Use whitespace intentionally.

Do not overcrowd tables.

==================================================
9. GLOBAL COLOR MAPPING
==================================================

Keep the existing visual identity but make colors semantically consistent.

BLUE:
Primary action only.

GREEN:
Success
Normal Stock
Active
Verified

AMBER:
Low Stock
Warning
Needs Attention

RED:
Out of Stock
Error
Destructive Action
Deactivate
Restore warning

GRAY:
Disabled
Inactive
Secondary

Never rely on color alone.

Use:
- text
- status labels
- icons
- badges

alongside colors.

==================================================
10. GLOBAL BUTTON REVISION
==================================================

Use:

SOLID BLUE:
Most important action on screen.

OUTLINE / GHOST:
Secondary action.

RED:
Destructive action.

DISABLED GRAY:
Unavailable action.

Buttons must communicate:
- what will happen
- whether the action is currently possible
- whether the action is dangerous

Do not use multiple equally prominent primary buttons on the same screen.

==================================================
11. GLOBAL FEEDBACK REVISION
==================================================

The existing Alert component should be used consistently.

Success:
"You successfully registered the product."

Error:
"Unable to complete Stock-Out. Only 5 units are available."

Warning:
"This adjustment changes the recorded inventory quantity."

Do not use vague feedback.

Avoid:
"Something went wrong."

Use:
"What happened?"
and
"What should the user do?"

Do not interrupt fast workflows with unnecessary modal confirmations.

==================================================
12. GLOBAL MODAL REVISION
==================================================

Keep the existing Modal component where practical.

Use modals only for:
- destructive actions
- confirmation of consequential actions
- focused short tasks

Do not use modals for:
- simple success notification
- ordinary search
- simple status display

==================================================
13. LOGIN REVISION
==================================================

Inspect the existing login screen.

Keep its identity.

Improve:
- field spacing
- labels
- visibility
- password visibility toggle
- error feedback
- primary button hierarchy

The login screen should communicate:
WHERE TO ENTER CREDENTIALS
WHAT TO PRESS
WHAT WENT WRONG
WHAT SUCCESS LOOKS LIKE

The login action should remain visually primary.

==================================================
14. ACCOUNT & USER MANAGEMENT REVISION
==================================================

Preserve the existing user table and tabs if they are useful.

Improve:
- search
- table readability
- role badges
- status badges
- action grouping
- modal consistency

USER TABLE:
Show:
User ID
Name
Username
Role
Status
Created
Actions

Avoid excessively dense rows.

Role:
Manager = clearly distinguished

Status:
Active = green
Inactive = gray

Deactivation must use confirmation.

Activation/deactivation should be reversible.

Do not use permanent deletion if inactive status already satisfies the requirement.

ROLES & PERMISSIONS:
Preserve the existing role matrix.

Make it easier to scan.

Use:
✓ allowed
— not allowed

Do not create unnecessary technical permission terminology.

==================================================
15. PRODUCT MANAGEMENT REVISION
==================================================

Inspect the existing Product Management module.

Do not redesign its information architecture unless it conflicts with the DFD.

Keep the core functions:

2.1 Add / Register Product
2.2 Update Product
2.3 Search / View Product
2.4 Manage Product Code & Classification

Improve:

REGISTRATION:
Product Code
Barcode
Name
Category
Unit
Price
Supplier
Description where appropriate

SEARCH:
Make product search prominent.

Support:
- product name
- product ID
- barcode

TABLE:
Use monospaced formatting for codes and numerical values.

Do not put reorder-level editing in Product Management if it already belongs to Inventory Management.

==================================================
16. SUPPLIER MANAGEMENT REVISION
==================================================

Preserve the existing supplier interface.

Improve:
- supplier cards
- contact visibility
- product relationships
- update workflow
- status handling

Supplier information should be grouped.

When products are linked to a supplier:
visually show the connection.

Use:
- badges
- tags
- grouped lists

Do not create supplier login functionality.

==================================================
17. STOCK-IN REVISION
==================================================

Inspect the existing Stock-In screen and refine it.

Make frequent data entry fast.

Fields should clearly identify:

Product
Current Stock
Quantity Received
Supplier
Date
Reference

Primary action:
Confirm Stock-In

After success:
- show success feedback
- update stock visibly
- preserve user location if possible
- avoid unnecessary navigation

==================================================
18. STOCK-OUT REVISION
==================================================

THIS IS THE HIGHEST PRIORITY SCREEN.

Treat the existing Stock-Out interface as an operational tool used repeatedly under time pressure.

DO NOT turn it into a general-purpose form if the current implementation already has a useful transaction layout.

Revise the existing screen toward:

LEFT SIDE:
Input Zone

RIGHT SIDE:
Current Transaction Zone

INPUT ZONE:

Large:
"Scan Barcode / Enter Item Code"

AUTOMATICALLY FOCUS THIS FIELD WHEN THE SCREEN OPENS.

The Staff user should be able to:
- scan
- identify
- enter quantity
- add item

without manually navigating through several controls.

After item identification, display adjacent:

Current Stock Available
Quantity to Remove

These values must be visually connected.

CURRENT TRANSACTION TABLE:

Show:
Product Code
Product Name
Quantity
Current Stock
Remaining Stock
Remove

SUCCESS FEEDBACK:
When scan succeeds:
temporarily highlight the row in subtle green.

Do not show a blocking popup for every successful scan.

ERROR:
If quantity exceeds stock:
prevent submission.

Show:
"Insufficient stock. Only X units are available."

Highlight the quantity field.

PRIMARY ACTION:
Confirm Stock-Out

SECONDARY:
Clear Transaction

Confirm Stock-Out should remain disabled while the transaction is invalid.

==================================================
19. STOCK ADJUSTMENT REVISION
==================================================

Preserve the current adjustment workflow but strengthen error prevention.

Display:
- Product
- Current Quantity
- New Quantity
- Difference
- Reason
- Remarks

The reason is required.

Use warning styling.

Before applying:
show a clear explanation that the adjustment changes recorded inventory.

If confirmation is required:
make the safe exit obvious.

==================================================
20. INVENTORY MONITORING REVISION
==================================================

This should be one of the most visually important Manager screens.

Existing KPI cards should be refined rather than removed.

Use:
Total Products
Total Stock
Low Stock
Out of Stock

Low Stock:
AMBER

Out of Stock:
RED

Normal:
GREEN

The main inventory table should sort by urgency:

1. Out of Stock
2. Low Stock
3. Normal

Do not require the Manager to scan an alphabetically sorted list first.

Add filters if they already exist or if the current table lacks an efficient way to find products.

==================================================
21. REORDER LEVEL REVISION
==================================================

Keep reorder-level editing under Inventory Management.

Manager-only.

Show:
Product
Current Stock
Current Reorder Level
New Reorder Level

Do not bury reorder settings inside unrelated Product Management screens.

After saving:
"Reorder level updated."

==================================================
22. LOW-STOCK ALERT REVISION
==================================================

The existing dashboard already contains an alert bar.

Refine it.

It should communicate:
HOW MANY items need attention
WHICH items need attention
WHY they need attention

Example:

"3 products need attention"

Then allow:
View Alerts →

On the alert page show:
Product
Current Stock
Reorder Level
Supplier
Status

Do not create supplier automation.

==================================================
23. REPORT GENERATION REVISION
==================================================

Preserve the existing report interface.

The intended flow should remain:

REQUEST
→ VALIDATE
→ RETRIEVE
→ GENERATE
→ PREVIEW
→ PRINT / EXPORT

Filters:
Date From
Date To
Product
Category
Report Type

Use a balanced preview.

Make report criteria obvious before generation.

Do not make users remember report syntax or complicated commands.

==================================================
24. AUDIT LOG REVISION
==================================================

Preserve the chronological audit-log approach.

Display:
Date/Time
User
Activity
Details

Keep the existing filtering concept.

Use consistent activity badges.

Important:
The user should NOT have to manually create ordinary audit entries.

The system should automatically record actions.

Make recent activity easy to scan.

==================================================
25. BACKUP & RESTORE REVISION
==================================================

Preserve the current backup structure.

BACKUP:
- Last Backup
- Next Scheduled Backup
- Backup Status
- Backup History where applicable

BACKUP NOW:
clear primary action

SCHEDULE:
separate action

PROGRESS:
Preparing
Creating
Verifying
Complete

RESTORE:
must be visually separated from normal backup activity.

When restoring:
- dim background heavily
- use warning icon
- explain consequences
- require explicit confirmation

Example:
"Restoring this backup may replace current database records."

Do not accidentally trigger restore through a normal-looking button.

==================================================
26. USE THE EXISTING CODE'S CURRENT COMPONENT SYSTEM
==================================================

When implementing revisions, prefer the current reusable components.

Examples already present in the codebase include:
- Badge
- StatusBadge
- StockBadge
- Input
- Select
- Textarea
- Btn
- Card
- Alert
- Modal
- TabBar

Improve these components globally where possible.

For example:
If button hierarchy is wrong across five screens,
fix the shared button component rather than individually inventing five button systems.

If status badges are inconsistent,
improve the shared badge styling.

If inputs have inconsistent focus behavior,
improve the reusable Input component.

This will improve consistency throughout the application.

==================================================
27. PRESERVE EXISTING DATA MODELS
==================================================

Do not unnecessarily change the underlying data structures simply to improve appearance.

The current project already models:
- User
- Product
- Supplier
- Stock Transaction
- Audit Log
- Backup File

Preserve those concepts.

The GUI revision should improve interaction with the existing structures.

==================================================
28. PERFORMANCE AND SPEED
==================================================

The interface should feel fast.

Prioritize:
- auto-focus where appropriate
- keyboard-friendly entry
- barcode scanner compatibility
- searchable lists
- predictable tab order
- minimal unnecessary navigation
- immediate visual feedback

Do not add animations that slow down operational tasks.

Avoid:
- excessive modal interruptions
- unnecessary page transitions
- slow decorative animations
- unnecessary confirmation steps

FAST does not mean careless.

FAST means:
the user spends less time figuring out what to do.

==================================================
29. USER JOURNEY VALIDATION
==================================================

Validate the most important Staff journey:

LOGIN
→ STOCK-OUT
→ SCAN ITEM
→ IDENTIFY ITEM
→ SEE CURRENT STOCK
→ ENTER QUANTITY
→ VALIDATE
→ CONFIRM
→ SEE UPDATED STOCK

Ask:
Where could the user hesitate?

Where could the user make a mistake?

Where could the user click the wrong control?

Where could the system fail to communicate what happened?

Revise the interface accordingly.

==================================================
30. MANAGER JOURNEY VALIDATION
==================================================

Validate:

LOGIN
→ DASHBOARD
→ SEE LOW-STOCK ITEMS
→ VIEW INVENTORY
→ CHECK PRODUCT / SUPPLIER
→ GENERATE REPORT
→ REVIEW AUDIT LOGS
→ MANAGE SYSTEM SETTINGS WHEN NECESSARY

The dashboard should make this journey short and obvious.

==================================================
31. FINAL HCI AUDIT
==================================================

Review the revised application using:

AFFORDANCE:
Do controls look usable?

SIGNIFIERS:
Does the interface clearly show what can be clicked, entered, scanned, or changed?

VISIBILITY:
Can users immediately see current stock, low stock, errors, and action status?

MAPPING:
Does the UI flow match the real-world inventory workflow?

FEEDBACK:
Does every important action tell the user what happened?

CONSTRAINTS:
Does the UI prevent invalid or dangerous actions?

ERROR PREVENTION:
Are common mistakes blocked before they happen?

USER CONTROL:
Can users cancel, clear, go back, or recover appropriately?

COGNITIVE LOAD:
Does the interface avoid forcing users to remember unnecessary details?

CONSISTENCY:
Do similar actions look and behave the same everywhere?

GESTALT:
Are related items grouped and unrelated items separated?

==================================================
32. FINAL REVISION STANDARD
==================================================

The completed interface should look like:

"THE SAME EXISTING SCHOOL SUPPLY INVENTORY SYSTEM, REFINED THROUGH USER-CENTERED DESIGN."

It should NOT look like:

"A COMPLETELY NEW INVENTORY APPLICATION."

Preserve what is already strong.

Improve what is weak.

Do not add features simply because they look impressive.

Every revision must have a usability reason.

Every major feature must correspond to the finalized DFD.

Every important design choice must support:
- speed
- clarity
- visibility
- learnability
- error prevention
- feedback
- consistency
- user control

FINAL IMPLEMENTATION EXPECTATION:

First inspect the existing code.

Then identify the current screens and reusable components.

Then revise them in place.

Do not rebuild the entire application blindly.

Do not remove working functionality unless it conflicts with the finalized system scope or creates a usability problem.

Prioritize the highest-impact revisions first:
1. Stock-Out workflow
2. Inventory Monitoring / Dashboard
3. Product Search
4. Stock-In
5. Stock Adjustment
6. User Management
7. Reports
8. Audit Logs
9. Backup & Restore

Make the interface demonstrably better for actual Staff and Inventory Manager tasks while preserving the existing application's identity and functional scope.