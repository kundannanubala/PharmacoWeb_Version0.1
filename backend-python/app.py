from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
import itertools
import joblib
import xgboost as xgb

import torch
import torch.nn as nn
import torch.nn.functional as F

app = Flask(__name__)
CORS(app)

# Define the DNN architecture
class DNN(nn.Module):
    def __init__(self):
        super(DNN, self).__init__()
        self.fc1 = nn.Linear(100, 2048)  # First hidden layer
        self.fc2 = nn.Linear(2048, 1024) # Second hidden layer
        self.fc3 = nn.Linear(1024, 512)  # Third hidden layer
        self.fc4 = nn.Linear(512, 256)   # Fourth hidden layer
        self.fc5 = nn.Linear(256, 128)   # Fifth hidden layer
        self.fc6 = nn.Linear(128, 64)    # Sixth hidden layer
        self.fc7 = nn.Linear(64, 32)     # Seventh hidden layer
        self.fc8 = nn.Linear(32, 86)     # Output layer for 86 classes

    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = F.relu(self.fc3(x))
        x = F.relu(self.fc4(x))
        x = F.relu(self.fc5(x))
        x = F.relu(self.fc6(x))
        x = F.relu(self.fc7(x))
        x = self.fc8(x)
        return x

# Load the pre-trained PyTorch model
model_path = "D:/college/Major/DL_Training/trained_model.pth"
model = DNN()
model.load_state_dict(torch.load(model_path))
model.eval()    

csv_file_path = "./ML_Final_50PCA.csv"
model_file_path = "./11thOCTFINALXGB.pkl"

# Load the pre-trained model
pre_trained_model = joblib.load(model_file_path)

# Define the mapping of output labels to statements
label_to_statement = {
    0: "No DDI",
    1: "{drug_a} can cause a decrease in the absorption of {drug_b} resulting in a reduced serum concentration and potentially a decrease in efficacy",
    2: "{drug_a} can cause an increase in the absorption of {drug_b} resulting in an increased serum concentration and potentially a worsening of adverse effects",
    3: "The absorption of {drug_b} can be decreased when combined with {drug_a}",
    4: "The bioavailability of {drug_b} can be decreased when combined with {drug_a}",
    5: "The bioavailability of {drug_b} can be increased when combined with {drug_a}",
    6: "The metabolism of {drug_b} can be decreased when combined with {drug_a}",
    7: "The metabolism of {drug_b} can be increased when combined with {drug_a}",
    8: "The protein binding of {drug_b} can be decreased when combined with {drug_a}",
    9: "The serum concentration of {drug_b} can be decreased when it is combined with {drug_a}",
    10: "The serum concentration of {drug_b} can be increased when it is combined with {drug_a}",
    11: "The serum concentration of the active metabolites of {drug_b} can be increased when {drug_b} is used in combination with {drug_a}",
    12: "The serum concentration of the active metabolites of {drug_b} can be reduced when {drug_b} is used in combination with {drug_a} resulting in a loss in efficacy",
    13: "The therapeutic efficacy of {drug_b} can be decreased when used in combination with {drug_a}",
    14: "The therapeutic efficacy of {drug_b} can be increased when used in combination with {drug_a}",
    15: "{drug_a} may decrease the excretion rate of {drug_b} which could result in a higher serum level",
    16: "{drug_a} may increase the excretion rate of {drug_b} which could result in a lower serum level and potentially a reduction in efficacy",
    17: "{drug_a} may decrease the cardiotoxic activities of {drug_b}",
    18: "{drug_a} may increase the cardiotoxic activities of {drug_b}",
    19: "{drug_a} may increase the central neurotoxic activities of {drug_b}",
    20: "{drug_a} may increase the hepatotoxic activities of {drug_b}",
    21: "{drug_a} may increase the nephrotoxic activities of {drug_b}",
    22: "{drug_a} may increase the neurotoxic activities of {drug_b}",
    23: "{drug_a} may increase the ototoxic activities of {drug_b}",
    24: "{drug_a} may decrease effectiveness of {drug_b} as a diagnostic agent",
    25: "The risk of a hypersensitivity reaction to {drug_b} is increased when it is combined with {drug_a}",
    26: "The risk or severity of adverse effects can be increased when {drug_a} is combined with {drug_b}",
    27: "The risk or severity of bleeding can be increased when {drug_a} is combined with {drug_b}",
    28: "The risk or severity of heart failure can be increased when {drug_b} is combined with {drug_a}",
    29: "The risk or severity of hyperkalemia can be increased when {drug_a} is combined with {drug_b}",
    30: "The risk or severity of hypertension can be increased when {drug_b} is combined with {drug_a}",
    31: "The risk or severity of hypotension can be increased when {drug_a} is combined with {drug_b}",
    32: "The risk or severity of QTc prolongation can be increased when {drug_a} is combined with {drug_b}",
    33: "{drug_a} may decrease the analgesic activities of {drug_b}",
    34: "{drug_a} may decrease the anticoagulant activities of {drug_b}",
    35: "{drug_a} may decrease the antihypertensive activities of {drug_b}",
    36: "{drug_a} may decrease the antiplatelet activities of {drug_b}",
    37: "{drug_a} may decrease the bronchodilatory activities of {drug_b}",
    38: "{drug_a} may decrease the diuretic activities of {drug_b}",
    39: "{drug_a} may decrease the neuromuscular blocking activities of {drug_b}",
    40: "{drug_a} may decrease the sedative activities of {drug_b}",
    41: "{drug_a} may decrease the stimulatory activities of {drug_b}",
    42: "{drug_a} may decrease the vasoconstricting activities of {drug_b}",
    43: "{drug_a} may increase the adverse neuromuscular activities of {drug_b}",
    44: "{drug_a} may increase the analgesic activities of {drug_b}",
    45: "{drug_a} may increase the anticholinergic activities of {drug_b}",
    46: "{drug_a} may increase the anticoagulant activities of {drug_b}",
    47: "{drug_a} may increase the antihypertensive activities of {drug_b}",
    48: "{drug_a} may increase the antiplatelet activities of {drug_b}",
    49: "{drug_a} may increase the antipsychotic activities of {drug_b}",
    50: "{drug_a} may increase the arrhythmogenic activities of {drug_b}",
    51: "{drug_a} may increase the atrioventricular blocking (AV block) activities of {drug_b}",
    52: "{drug_a} may increase the bradycardic activities of {drug_b}",
    53: "{drug_a} may increase the bronchoconstrictory activities of {drug_b}",
    54: "{drug_a} may increase the central nervous system depressant (CNS depressant) activities of {drug_b}",
    55: "{drug_a} may increase the central nervous system depressant (CNS depressant) and hypertensive activities of {drug_b}",
    56: "{drug_a} may increase the constipating activities of {drug_b}",
    57: "{drug_a} may increase the dermatologic adverse activities of {drug_b}",
    58: "{drug_a} may increase the fluid retaining activities of {drug_b}",
    59: "{drug_a} may increase the hypercalcemic activities of {drug_b}",
    60: "{drug_a} may increase the hyperglycemic activities of {drug_b}",
    61: "{drug_a} may increase the hyperkalemic activities of {drug_b}",
    62: "{drug_a} may increase the hypertensive activities of {drug_b}",
    63: "{drug_a} may increase the hypocalcemic activities of {drug_b}",
    64: "{drug_a} may increase the hypoglycemic activities of {drug_b}",
    65: "{drug_a} may increase the hypokalemic activities of {drug_b}",
    66: "{drug_a} may increase the hyponatremic activities of {drug_b}",
    67: "{drug_a} may increase the hypotensive activities of {drug_b}",
    68: "{drug_a} may increase the hypotensive and central nervous system depressant (CNS depressant) activities of {drug_b}",
    69: "{drug_a} may increase the immunosuppressive activities of {drug_b}",
    70: "{drug_a} may increase the myelosuppressive activities of {drug_b}",
    71: "{drug_a} may increase the myopathic rhabdomyolysis activities of {drug_b}",
    72: "{drug_a} may increase the neuroexcitatory activities of {drug_b}",
    73: "{drug_a} may increase the neuromuscular blocking activities of {drug_b}",
    74: "{drug_a} may increase the orthostatic hypotensive activities of {drug_b}",
    75: "{drug_a} may increase the photosensitizing activities of {drug_b}",
    76: "{drug_a} may increase the QTc-prolonging activities of {drug_b}",
    77: "{drug_a} may increase the respiratory depressant activities of {drug_b}",
    78: "{drug_a} may increase the sedative activities of {drug_b}",
    79: "{drug_a} may increase the serotonergic activities of {drug_b}",
    80: "{drug_a} may increase the stimulatory activities of {drug_b}",
    81: "{drug_a} may increase the tachycardic activities of {drug_b}",
    82: "{drug_a} may increase the thrombogenic activities of {drug_b}",
    83: "{drug_a} may increase the ulcerogenic activities of {drug_b}",
    84: "{drug_a} may increase the vasoconstricting activities of {drug_b}",
    85: "{drug_a} may increase the vasodilatory activities of {drug_b}",
    86: "{drug_a} may increase the vasopressor activities of {drug_b}"
}


@app.route('/filter-drugs', methods=['POST'])
def filter_drugs():
    data = request.json
    drugs_list = data.get('drugs', [])

    df = pd.read_csv(csv_file_path)
    df['Drug_Name'] = df['Drug_Name'].str.lower()

    processable_drugs_df = df['Drug_Name'].unique()
    processable_drugs = set(processable_drugs_df)
    
    input_drugs = set(drug.lower() for drug in drugs_list)
    found_drugs = input_drugs.intersection(processable_drugs)
    not_found_drugs = input_drugs.difference(processable_drugs)

    response = {
        'processable_drugs': list(found_drugs),
        'non_processable_drugs': list(not_found_drugs),
    }

    if len(found_drugs) > 1:
        drug_pairs = list(itertools.combinations(found_drugs, 2))
        concatenated_data = []

        for drug2, drug1 in drug_pairs:
            drug1_features = df[df['Drug_Name'] == drug1].iloc[0, 1:].reset_index(drop=True)
            drug2_features = df[df['Drug_Name'] == drug2].iloc[0, 1:].reset_index(drop=True)
            combined_features = pd.concat([drug1_features, drug2_features], ignore_index=True)
            concatenated_data.append(combined_features.tolist())

        if concatenated_data:
            num_features = len(concatenated_data[0])
            column_names = [f'feature_{i}' for i in range(num_features)]
            input_profile_df = pd.DataFrame(concatenated_data, columns=column_names)
            input_tensor = torch.FloatTensor(concatenated_data)
            with torch.no_grad():
                outputs = model(input_tensor)
                _, predictions = torch.max(outputs, 1)
            
            # predictions = pre_trained_model.predict(input_profile_df)
            
            # Map predictions to statements and include labels in the response
            predictions_response = [{
                'label': int(pred),
                'statement': label_to_statement.get(int(pred), "Unknown label"),
                'drug_pair': f"{drug_pairs[i][0]} and {drug_pairs[i][1]}"
            } for i, pred in enumerate(predictions)]

            response['predictions'] = predictions_response

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
