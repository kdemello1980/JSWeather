package com.demello.project1.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import com.demello.project1.model.*;

public class DAO {
	private Connection connection = null;
	private PreparedStatement stmt = null;
	private static final String CONNECTION_USERNAME = "postgres";
	private static final String CONNECTION_PASSWORD = "postgres";
	private static final String URL = "jdbc:postgresql://localhost:5432/zip_codes";
	private static Connection conneciton;

	public static synchronized Connection getConnection() throws SQLException {
		if (conneciton == null) {
			try {
				Class.forName("org.postgresql.Driver");
			} catch (ClassNotFoundException e) {
				System.out.println("Could not register driver!");
				e.printStackTrace();
			}
			conneciton = DriverManager.getConnection(URL, CONNECTION_USERNAME, CONNECTION_PASSWORD);			
			System.out.println("Opened connection...");

		}
		
		if (conneciton.isClosed()) {
//			System.out.println("Opening new connection...");
			conneciton = DriverManager.getConnection(URL, CONNECTION_USERNAME, CONNECTION_PASSWORD);

		}
		return conneciton;
	}
	
	public ArrayList<City> getAllCities(){
		ArrayList<City> cities = null;
		String sql = "SELECT * FROM zip_codes ORDER BY state ASC";
		
		try {
			connection = getConnection();
			stmt = conneciton.prepareStatement(sql);
			ResultSet rs =  stmt.executeQuery();
			cities = new ArrayList<City>();
			if (rs.next()) {
				do {
					cities.add(new City(rs.getString("city"),
							rs.getString("state"), rs.getString("zip"), rs.getDouble("latitude"), rs.getDouble("longitude")));
				} while (rs.next());
			}
			rs.close();
			return cities;
		} catch (SQLException e) {
			e.printStackTrace();
			return null;
		} finally {
			closeResources();
		}
	}
	
	public boolean addCity(City city) {
		String sql = "INSERT INTO zip_codes (city, state, zip, latitude, longitude) VALUES (?,?,?,?,?)";
		
		try {
			connection = getConnection();
			stmt = conneciton.prepareStatement(sql);
			stmt.setString(1, city.getCapital());
			stmt.setString(2, city.getState());
			stmt.setString(3, city.getZipCode());
			stmt.setDouble(4, city.getLatitude());
			stmt.setDouble(5, city.getLongitude());
			
			if (stmt.executeUpdate() != 0) {
				return true;
			} else {
				return false;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		} finally {
			closeResources();
		}
	}
	
	public ArrayList<String> getStates(){
		String sql = "SELECT UNIQUE state FROM zip_codes ORDER BY state ASC";
		ArrayList<String> states = null;
		
		try {
			connection = getConnection();
			stmt = connection.prepareStatement(sql);
			ResultSet rs = stmt.executeQuery();
			if (rs.next()) {
				states = new ArrayList<String>();
				do {
					states.add(rs.getString("state"));
				} while (rs.next());
			}
			rs.close();
			return states;
		} catch (SQLException e) {
			e.printStackTrace();
			return null;
		} finally {
			closeResources();
		}
	}
	
	
	// Closing all resources is important, to prevent memory leaks. 
	// Ideally, you really want to close them in the reverse-order you open them
	private void closeResources() {
		try {
			if (stmt != null)
				stmt.close();
		} catch (SQLException e) {
			System.out.println("Could not close statement!");
			e.printStackTrace();
		}
		
		try {
			if (connection != null)
				connection.close();
		} catch (SQLException e) {
			System.out.println("Could not close connection!");
			e.printStackTrace();
		}
	}
}
