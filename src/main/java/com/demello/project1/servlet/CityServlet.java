package com.demello.project1.servlet;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.demello.project1.dao.DAO;
import com.demello.project1.model.City;
import com.google.gson.Gson;

/**
 * Servlet implementation class CityServlet
 */
@WebServlet("/CityServlet")
public class CityServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private DAO dao = new DAO();
	private Gson gson = new Gson();
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CityServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		ArrayList<City> cities = dao.getAllCities();
		String json = gson.toJson(cities);
		response.setContentType("application/json");
		response.setStatus(200);
		response.getWriter().print(json);
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String city = request.getParameter("city");
		String state = request.getParameter("state");
		String zip = request.getParameter("zip");
		double lat = Double.valueOf(request.getParameter("latitude"));
		double lon = Double.valueOf(request.getParameter("longitude"));
		
		City c1 = new City(city, state, zip, lat, lon);
		dao.addCity(c1);
		response.sendRedirect(request.getContextPath());
	}
}
