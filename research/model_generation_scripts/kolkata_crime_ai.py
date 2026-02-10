from google.colab import files

# This will open a file explorer window for you to select files from your local machine.
uploaded = files.upload()



# %% [markdown]
# New Cell

import pandas as pd

df = pd.read_csv('crime_kolkata.csv')
df.head()



# %% [markdown]
# New Cell

df.shape
df.columns


# %% [markdown]
# New Cell

df.describe()

# %% [markdown]
# New Cell

import matplotlib.pyplot as plt

# The DataFrame 'df' already contains a 'Month' column (as seen from df.columns),
# so there's no need to create a 'Date' column or extract the month again.
# The original error 'KeyError: 'Date'' occurred because 'df' did not have a 'Date' column.

# Count crimes per month using the existing 'Month' column
monthly_crime = df.groupby('Month').size()

# plot
plt.figure()
monthly_crime.plot()
plt.xlabel('Month')
plt.ylabel('Number of Crimes')
plt.title('Crime Trend Over Time (Monthly)')
plt.show()

# %% [markdown]
# New Cell

area_crime = df['Ward'].value_counts().sort_index()

plt.figure()
area_crime.plot(kind='bar')
plt.xlabel('Ward')
plt.ylabel('Crime Count')
plt.title('Crime Count by Ward')
plt.show()


# %% [markdown]
# New Cell

# The original error 'KeyError: 'Date'' occurred because the DataFrame 'df' does not have a 'Date' column.
# Instead of a specific 'Hour' column, we can analyze crime patterns using the 'TimeSlot' column.
# The 'TimeSlot' column contains categories like 'Afternoon', 'Night', 'Evening', which represent time periods.

timeslot_crime = df.groupby('TimeSlot').size().sort_values(ascending=False)

plt.figure(figsize=(10, 6)) # Make the plot larger for better readability
timeslot_crime.plot(kind='bar')
plt.xlabel('Time Slot')
plt.ylabel('Crime Count')
plt.title('Crime Pattern by Time Slot')
plt.xticks(rotation=45, ha='right') # Rotate x-axis labels for better readability
plt.tight_layout() # Adjust layout to prevent labels from overlapping
plt.show()

# %% [markdown]
# New Cell

!pip install folium


# %% [markdown]
# New Cell

import folium
from folium.plugins import HeatMap


# %% [markdown]
# New Cell

import folium

# Define a center for kolkata, as 'kolkata_center' is not defined in this cell.
# This assumes kolkata's approximate center.
Kolkata_center = [22.527634, 88.320593]

# Initialize the map object 'm' before using it
m = folium.Map(location=Kolkata_center, zoom_start=11)

for _, row in df.sample(1000).iterrows():   # limit points for speed
    folium.CircleMarker(
        location=[row['Latitude'], row['Longitude']],
        radius=2,
        color='red',
        fill=True,
        fill_opacity=0.6
    ).add_to(m)

m

# %% [markdown]
# New Cell

heat_data = df[['Latitude', 'Longitude']].values.tolist()

heat_map = folium.Map(location=Kolkata_center, zoom_start=11)

HeatMap(
    heat_data,
    radius=10,
    blur=15,
    max_zoom=13
).add_to(heat_map)

heat_map

# %% [markdown]
# New Cell

crime_grouped = (
    df.groupby(['Ward', 'Year', 'Month'])
      .size()
      .reset_index(name='Crime_Count')
)

crime_grouped.head()

# %% [markdown]
# New Cell

X = crime_grouped[['Ward', 'Year', 'Month']]
y = crime_grouped['Crime_Count']


# %% [markdown]
# New Cell

from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split( X, y, test_size=0.2)


# %% [markdown]
# New Cell

X_train.shape, X_test.shape

# %% [markdown]
# New Cell

from sklearn.ensemble import RandomForestRegressor
import pandas as pd

model = RandomForestRegressor(
    n_estimators=100)

model.fit(X_train, y_train)

# %% [markdown]
# New Cell

ypred = model.predict(X_test)
#in array show the round rasult
ypred.round()

# %% [markdown]
# New Cell

import numpy as np

from sklearn.metrics import mean_absolute_error,mean_squared_error
mae=mean_absolute_error(y_test,ypred)
mse=mean_squared_error(y_test,ypred)
rmse=np.sqrt(mse)

# %% [markdown]
# New Cell

mae,mse,rmse

# %% [markdown]
# New Cell

from sklearn.metrics import r2_score

y_pred = model.predict(X_test)

r2 = r2_score(y_test, y_pred)
print("R² Score:", r2)

# %% [markdown]
# New Cell

print("Crime Prediction System")
print("-----------------------")

def predict_crime(area, year, month):

    # Create a DataFrame for the new input with correct column names matching X_train
    input_data = pd.DataFrame([[area, year, month]],
                               columns=['Ward', 'Year', 'Month'])

    # Make prediction directly using input_data
    prediction = model.predict(input_data)

    # Return the predicted crime count (round to nearest integer as crime counts are discrete)
    return round(prediction[0])

area = int(input("enter ward no (1–77): "))
year = int(input("Enter Year (e.g., 2026): "))
month = int(input("Enter Month (1–12): "))


prediction = predict_crime(area, year, month)

print("\n Prediction Result")
print("-------------------")
print(f"Expected number of crimes: {prediction}")

# %% [markdown]
# New Cell

import folium

# Get latitude and longitude for the entered community area
community_data = df[df['Ward'] == area]
if not community_data.empty:
    lat = community_data['Latitude'].mean()
    lon = community_data['Longitude'].mean()
else:
    # Fallback to Kolkata center if the community area is not found or has no coordinates
    lat, lon = Kolkata_center

# Use the prediction from the previous cell
predicted_crimes = prediction

# Define risk level and color based on predicted crimes
if predicted_crimes <= 1:
    risk = "Low"
    color = "green"
elif predicted_crimes <= 2:
    risk = "Medium"
    color = "orange"
else:
    risk = "High"
    color = "red"

m = folium.Map(location=[lat, lon], zoom_start=13)

folium.Marker(
    location=[lat, lon],
    popup=f"""
    <b>Community Area:</b> {area}<br>
    <b>Date:</b> {month}/{year} <br>
    <b>Predicted Crimes:</b> {predicted_crimes}<br>
    <b>Risk Level:</b> {risk}
    """,
    icon=folium.Icon(color=color)
).add_to(m)

m

# %% [markdown]
# New Cell

import matplotlib.pyplot as plt

plt.figure(figsize=(7,5))

# Predicted values (blue)
plt.scatter(y_test, y_pred, color='blue', alpha=0.6, label='Predicted')

# Ideal line (perfect prediction)
plt.plot(
    [y_test.min(), y_test.max()],
    [y_test.min(), y_test.max()],
    color='red',
    linewidth=2,
    label='Ideal (y = x)'
)

plt.xlabel("Actual Crime Count")
plt.ylabel("Predicted Crime Count")
plt.title("Actual vs Predicted Crime Count")
plt.legend()
plt.grid(True)

plt.show()

