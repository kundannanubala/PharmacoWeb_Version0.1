from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import itertools
import joblib
import numpy as np
import torch
import torch.nn.functional as F

app = Flask(__name__)
CORS(app)

csv_file_path = "./ML_Final_50PCA.csv"
rf_model_path = "./6thNOV_RF_updated.pkl" 
xgb_model_path = "./6thNOV_xgb_updated.pkl"
dnn_model_path = "./trained_model.pth"

# Load the pre-trained models
rf_model = joblib.load(rf_model_path)
xgb_model = joblib.load(xgb_model_path)

class DNN(torch.nn.Module):
    def __init__(self):
        super(DNN, self).__init__()
        self.fc1 = torch.nn.Linear(100, 2048)
        self.fc2 = torch.nn.Linear(2048, 1024)
        self.fc3 = torch.nn.Linear(1024, 512)
        self.fc4 = torch.nn.Linear(512, 256)
        self.fc5 = torch.nn.Linear(256, 128)
        self.fc6 = torch.nn.Linear(128, 64)
        self.fc7 = torch.nn.Linear(64, 32)
        self.fc8 = torch.nn.Linear(32, 86)

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

dnn_model = DNN()
dnn_model.load_state_dict(torch.load(dnn_model_path))
dnn_model.eval()

# Define the mapping of output labels to statements
label_to_statement = {
    0: "{drug_a} may increase the orthostatic hypotensive activities of {drug_b}",
    1: "The risk or severity of adverse effects can be increased when {drug_a} is combined with {drug_b}",
    2: "The absorption of {drug_b} can be decreased when combined with {drug_a}",
    3: "The bioavailability of {drug_b} can be decreased when combined with {drug_a}",
    4: "The bioavailability of {drug_b} can be increased when combined with {drug_a}",
    5: "The metabolism of {drug_b} can be decreased when combined with {drug_a}",
    6: "The metabolism of {drug_b} can be increased when combined with {drug_a}",
    7: "The protein binding of {drug_b} can be decreased when combined with {drug_a}",
    8: "The serum concentration of {drug_b} can be decreased when it is combined with {drug_a}",
    9: "The serum concentration of {drug_b} can be increased when it is combined with {drug_a}",
    10: "The serum concentration of the active metabolites of {drug_b} can be increased when {drug_b} is used in combination with {drug_a}",
    11: "The serum concentration of the active metabolites of {drug_b} can be reduced when {drug_b} is used in combination with {drug_a} resulting in a loss in efficacy",
    12: "The therapeutic efficacy of {drug_b} can be decreased when used in combination with {drug_a}",
    13: "The therapeutic efficacy of {drug_b} can be increased when used in combination with {drug_a}",
    14: "{drug_a} may decrease the excretion rate of {drug_b} which could result in a higher serum level",
    15: "{drug_a} may increase the excretion rate of {drug_b} which could result in a lower serum level and potentially a reduction in efficacy",
    16: "{drug_a} may decrease the cardiotoxic activities of {drug_b}",
    17: "{drug_a} may increase the cardiotoxic activities of {drug_b}",
    18: "{drug_a} may increase the central neurotoxic activities of {drug_b}",
    19: "{drug_a} may increase the hepatotoxic activities of {drug_b}",
    20: "{drug_a} may increase the nephrotoxic activities of {drug_b}",
    21: "{drug_a} may increase the neurotoxic activities of {drug_b}",
    22: "{drug_a} may increase the ototoxic activities of {drug_b}",
    23: "{drug_a} may decrease effectiveness of {drug_b} as a diagnostic agent",
    24: "The risk of a hypersensitivity reaction to {drug_b} is increased when it is combined with {drug_a}",
    25: "{drug_a} can cause an increase in the absorption of {drug_b} resulting in an increased serum concentration and potentially a worsening of adverse effects",
    26: "The risk or severity of bleeding can be increased when {drug_a} is combined with {drug_b}",
    27: "The risk or severity of heart failure can be increased when {drug_b} is combined with {drug_a}",
    28: "The risk or severity of hyperkalemia can be increased when {drug_a} is combined with {drug_b}",
    29: "The risk or severity of hypertension can be increased when {drug_b} is combined with {drug_a}",
    30: "The risk or severity of hypotension can be increased when {drug_a} is combined with {drug_b}",
    31: "The risk or severity of QTc prolongation can be increased when {drug_a} is combined with {drug_b}",
    32: "{drug_a} may decrease the analgesic activities of {drug_b}",
    33: "{drug_a} may decrease the anticoagulant activities of {drug_b}",
    34: "{drug_a} may decrease the antihypertensive activities of {drug_b}",
    35: "{drug_a} may decrease the antiplatelet activities of {drug_b}",
    36: "{drug_a} may decrease the bronchodilatory activities of {drug_b}",
    37: "{drug_a} may decrease the diuretic activities of {drug_b}",
    38: "{drug_a} may decrease the neuromuscular blocking activities of {drug_b}",
    39: "{drug_a} may decrease the sedative activities of {drug_b}",
    40: "{drug_a} may decrease the stimulatory activities of {drug_b}",
    41: "{drug_a} may decrease the vasoconstricting activities of {drug_b}",
    42: "{drug_a} may increase the adverse neuromuscular activities of {drug_b}",
    43: "{drug_a} may increase the analgesic activities of {drug_b}",
    44: "{drug_a} may increase the anticholinergic activities of {drug_b}",
    45: "{drug_a} may increase the anticoagulant activities of {drug_b}",
    46: "{drug_a} may increase the antihypertensive activities of {drug_b}",
    47: "{drug_a} may increase the antiplatelet activities of {drug_b}",
    48: "{drug_a} may increase the antipsychotic activities of {drug_b}",
    49: "{drug_a} may increase the photosensitizing activities of {drug_b}",
    50: "{drug_a} may increase the atrioventricular blocking (AV block) activities of {drug_b}",
    51: "{drug_a} may increase the bradycardic activities of {drug_b}",
    52: "{drug_a} may increase the bronchoconstrictory activities of {drug_b}",
    53: "{drug_a} may increase the central nervous system depressant (CNS depressant) activities of {drug_b}",
    54: "{drug_a} may increase the central nervous system depressant (CNS depressant) and hypertensive activities of {drug_b}",
    55: "{drug_a} may increase the constipating activities of {drug_b}",
    56: "{drug_a} may increase the dermatologic adverse activities of {drug_b}",
    57: "{drug_a} may increase the fluid retaining activities of {drug_b}",
    58: "{drug_a} may increase the hypercalcemic activities of {drug_b}",
    59: "{drug_a} may increase the hyperglycemic activities of {drug_b}",
    60: "{drug_a} may increase the hyperkalemic activities of {drug_b}",
    61: "{drug_a} may increase the hypertensive activities of {drug_b}",
    62: "{drug_a} may increase the hypocalcemic activities of {drug_b}",
    63: "{drug_a} may increase the hypoglycemic activities of {drug_b}",
    64: "{drug_a} may increase the hypokalemic activities of {drug_b}",
    65: "{drug_a} may increase the hyponatremic activities of {drug_b}",
    66: "{drug_a} may increase the hypotensive activities of {drug_b}",
    67: "{drug_a} may increase the hypotensive and central nervous system depressant (CNS depressant) activities of {drug_b}",
    68: "{drug_a} may increase the immunosuppressive activities of {drug_b}",
    69: "{drug_a} may increase the myelosuppressive activities of {drug_b}",
    70: "{drug_a} may increase the myopathic rhabdomyolysis activities of {drug_b}",
    71: "{drug_a} may increase the neuroexcitatory activities of {drug_b}",
    72: "{drug_a} may increase the neuromuscular blocking activities of {drug_b}",
    73: "The risk or severity of adverse effects can be increased when {drug_a} is combined with {drug_b}",
    74: "{drug_a} can cause a decrease in the absorption of {drug_b} resulting in a reduced serum concentration and potentially a decrease in efficacy",
    75: "The risk or severity of adverse effects can be increased when {drug_a} is combined with {drug_b}",
    76: "{drug_a} may increase the respiratory depressant activities of {drug_b}",
    77: "{drug_a} may increase the sedative activities of {drug_b}",
    78: "{drug_a} may increase the serotonergic activities of {drug_b}",
    79: "{drug_a} may increase the stimulatory activities of {drug_b}",
    80: "{drug_a} may increase the tachycardic activities of {drug_b}",
    81: "{drug_a} may increase the thrombogenic activities of {drug_b}",
    82: "{drug_a} may increase the ulcerogenic activities of {drug_b}",
    83: "{drug_a} may increase the vasoconstricting activities of {drug_b}",
    84: "{drug_a} may increase the vasodilatory activities of {drug_b}",
    85: "{drug_a} may increase the vasopressor activities of {drug_b}"
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
            column_names = [f'PC_{i+1}' for i in range(num_features)]
            input_profile_df = pd.DataFrame(concatenated_data, columns=column_names)
            X = input_profile_df.to_numpy()

            # Make predictions with RF, XGB, and DNN
            rf_predictions = rf_model.predict(X)
            predictions = xgb_model.predict(X)
            
            X_tensor = torch.FloatTensor(X)
            dnn_predictions = []
            with torch.no_grad():
                for i in range(0, X_tensor.size(0), 64):
                    outputs = dnn_model(X_tensor[i:i+64])
                    _, predicted = torch.max(outputs.data, 1)
                    dnn_predictions.extend(predicted.cpu().numpy())
            dnn_predictions = np.array(dnn_predictions)

            # Apply weighted voting based on individual model accuracies
            weights = np.array([0.88, 0.98, 0.924])  # Random Forest, XGBoost, DNN

            # Convert class labels to votes with weights
            votes = np.zeros((X.shape[0], 86))  # 86 classes
            for i in range(X.shape[0]):
                votes[i, rf_predictions[i]] += weights[0]
                votes[i, predictions[i]] += weights[1]
                votes[i, dnn_predictions[i]] += weights[2]

            # Determine final predictions from weighted votes
            final_predictions = np.argmax(votes, axis=1)

            # Map predictions to statements and include labels in the response
            predictions_response = [{
                'label': int(pred),
                'statement': label_to_statement.get(int(pred), "Unknown label"),
                'drug_pair': f"{drug_pairs[i][0]} and {drug_pairs[i][1]}"
            } for i, pred in enumerate(final_predictions)]

            response['predictions'] = predictions_response

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
