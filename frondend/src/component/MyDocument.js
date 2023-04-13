import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: "20px",
  },
  table: {
    display: "table",
    width: "auto",
    margin: "auto",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderBottom: "1px solid #000000",
    borderRight: "1px solid #000000",
    textAlign: "center",
    fontWeight: "bold",
    padding: "5px",
  },
  tableCol: {
    width: "25%",
    borderBottom: "1px solid #000000",
    borderRight: "1px solid #000000",
    textAlign: "center",
    padding: "5px",
  },
});

const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text>Order ID</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Amount</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Payment Status</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Order Status</Text>
          </View>
        </View>
        {data.map((row) => (
          <View style={styles.tableRow} key={row.order_id}>
            <View style={styles.tableCol}>
              <Text>{row.order_id}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{row.totalAmount}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{row.paymentStatus}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{row.orderStatus}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default MyDocument;
